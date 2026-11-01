import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import type * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';
import { CountUpDirective } from '../../shared/count-up.directive';
import {
  ALERTS,
  AlertItem,
  DashboardData,
  Kpi,
  RECENT_TRANSACTIONS,
  RangeKey,
  Transaction,
  TxnStatus,
  buildDashboardData,
  formatBdt,
  maskCard,
  timeAgo,
} from './dashboard.data';
import {
  PALETTE,
  binsChart,
  categoriesChart,
  donutChart,
  hoursChart,
  volumeChart,
} from './dashboard.charts';

type StatusFilter = 'all' | TxnStatus;

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, DecimalPipe, HighchartsChartComponent, CountUpDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  readonly ranges: RangeKey[] = ['7D', '30D', '90D'];
  readonly statusFilters: StatusFilter[] = ['all', 'approved', 'pending', 'declined'];
  readonly alerts: AlertItem[] = ALERTS;
  readonly formatBdt = formatBdt;
  readonly maskCard = maskCard;
  readonly timeAgo = timeAgo;

  range: RangeKey = '30D';
  loading = true;
  updatedAt = new Date();

  data!: DashboardData;
  statusFilter: StatusFilter = 'all';
  search = '';

  volumeOptions: Highcharts.Options = {};
  cardMixOptions: Highcharts.Options = {};
  approvalOptions: Highcharts.Options = {};
  hoursOptions: Highcharts.Options = {};
  categoriesOptions: Highcharts.Options = {};
  binsOptions: Highcharts.Options = {};

  selected: Transaction | null = null;

  @ViewChild('detailDialog') private detailDialog!: ElementRef<HTMLDialogElement>;

  private loadTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.load(550);
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadTimer);
  }

  setRange(range: RangeKey): void {
    if (range !== this.range) {
      this.range = range;
      this.load(450);
    }
  }

  refresh(): void {
    this.load(650);
  }

  setStatusFilter(filter: StatusFilter): void {
    this.statusFilter = filter;
  }

  onSearch(event: Event): void {
    this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openDetails(txn: Transaction): void {
    this.selected = txn;
    this.detailDialog.nativeElement.showModal();
  }

  closeDetails(): void {
    this.detailDialog.nativeElement.close();
  }

  // The dialog element itself is the backdrop target; clicks inside content have a child target.
  onDialogClick(event: MouseEvent): void {
    if (event.target === this.detailDialog.nativeElement) {
      this.closeDetails();
    }
  }

  settlementNote(txn: Transaction): string {
    switch (txn.status) {
      case 'approved':
        return 'Scheduled for next business day';
      case 'pending':
        return 'Awaiting settlement';
      default:
        return 'Funds were not moved';
    }
  }

  get transactions(): Transaction[] {
    return RECENT_TRANSACTIONS.filter((txn) => {
      const matchesStatus = this.statusFilter === 'all' || txn.status === this.statusFilter;
      const matchesSearch =
        !this.search ||
        `${txn.merchant} ${txn.id} ${txn.category} ${txn.card} ${txn.product} ${txn.cardType}`
          .toLowerCase()
          .includes(this.search);
      return matchesStatus && matchesSearch;
    });
  }

  get cardTotal(): number {
    return this.data.cardMix.reduce((total, item) => total + item.value, 0);
  }

  get cardMixColors(): string[] {
    return [PALETTE.primary, PALETTE.sky, PALETTE.amber];
  }

  get peakHour(): string {
    const peak = Math.max(...this.data.hours);
    return this.hourLabel(this.data.hours.indexOf(peak));
  }

  get hourStats(): { label: string; value: string; hint: string }[] {
    const hours = this.data.hours;
    const total = hours.reduce((sum, v) => sum + v, 0);
    const compact = (n: number) =>
      n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toLocaleString('en-IN');

    // Busiest rolling 3-hour window, useful for staffing and rule tuning.
    let windowStart = 0;
    let windowSum = 0;
    for (let i = 0; i <= hours.length - 3; i++) {
      const sum = hours[i] + hours[i + 1] + hours[i + 2];
      if (sum > windowSum) {
        windowSum = sum;
        windowStart = i;
      }
    }

    const peak = Math.max(...hours);
    const quiet = Math.min(...hours);
    return [
      { label: 'Peak hour', value: this.peakHour, hint: `${compact(peak)} transactions` },
      {
        label: 'Busiest 3 hours',
        value: `${this.hourLabel(windowStart)}–${this.hourLabel(windowStart + 3)}`,
        hint: `${Math.round((windowSum / total) * 100)}% of daily volume`,
      },
      { label: 'Quietest hour', value: this.hourLabel(hours.indexOf(quiet)), hint: `${compact(quiet)} transactions` },
      { label: 'Hourly average', value: compact(Math.round(total / 24)), hint: 'transactions per hour' },
    ];
  }

  trackKpi(_: number, kpi: Kpi): string {
    return kpi.id;
  }

  sparkLine(values: number[]): string {
    return this.sparkPoints(values)
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(' ');
  }

  sparkArea(values: number[]): string {
    return `${this.sparkLine(values)} L100 32 L0 32 Z`;
  }

  // For "Fraud blocked" and similar, a falling number is good news.
  isPositive(kpi: Kpi): boolean {
    return kpi.id === 'fraud' ? kpi.delta < 0 : kpi.delta >= 0;
  }

  funnelWidth(value: number): number {
    return Math.round((value / this.data.lifecycle[0].value) * 100);
  }

  private hourLabel(hour: number): string {
    return `${(hour % 24).toString().padStart(2, '0')}:00`;
  }

  private sparkPoints(values: number[]): [number, number][] {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    return values.map((v, i) => [
      (i / (values.length - 1)) * 100,
      28 - ((v - min) / span) * 24,
    ]);
  }

  private load(delay: number): void {
    clearTimeout(this.loadTimer);
    this.loading = true;
    this.loadTimer = setTimeout(() => {
      this.data = buildDashboardData(this.range);
      this.buildCharts();
      this.updatedAt = new Date();
      this.loading = false;
    }, delay);
  }

  private buildCharts(): void {
    const d = this.data;
    this.volumeOptions = volumeChart(d);
    this.hoursOptions = hoursChart(d);
    this.categoriesOptions = categoriesChart(d);
    this.binsOptions = binsChart(d);
    this.cardMixOptions = donutChart(
      d.cardMix.map((item, i) => ({ name: item.name, y: item.value, color: this.cardMixColors[i] })),
      'Cards',
    );
    this.approvalOptions = donutChart(
      [
        { name: 'Approved', y: d.approval.approved, color: PALETTE.green },
        { name: 'Declined', y: d.approval.declined, color: PALETTE.red },
      ],
      'Authorizations',
    );
  }
}
