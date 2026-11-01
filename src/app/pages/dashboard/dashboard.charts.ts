import type * as Highcharts from 'highcharts';
import { DashboardData } from './dashboard.data';

export const PALETTE = {
  primary: '#1E40AF',
  sky: '#38BDF8',
  amber: '#F59E0B',
  green: '#10B981',
  red: '#EF4444',
  ink: '#0F1B3D',
  muted: '#5B6B86',
  grid: '#E8EDF5',
  surface: '#FFFFFF',
};

const FONT = "'Fira Sans', 'Noto Sans Bengali', system-ui, sans-serif";
const axisLabel = { color: PALETTE.muted, fontSize: '12px', fontFamily: FONT };

const baseChart = (height: number, type: string): Highcharts.ChartOptions => ({
  type,
  height,
  backgroundColor: 'transparent',
  style: { fontFamily: FONT },
  spacing: [8, 4, 4, 4],
});

const common: Highcharts.Options = {
  title: { text: undefined },
  credits: { enabled: false },
  plotOptions: { series: { animation: { duration: 900 } } },
};

const tooltip: Highcharts.TooltipOptions = {
  backgroundColor: PALETTE.ink,
  borderWidth: 0,
  borderRadius: 10,
  shadow: false,
  style: { color: '#fff', fontSize: '12px', fontFamily: FONT },
};

const withAlpha = (hex: string, alpha: number): string => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const gradient = (color: string): Highcharts.GradientColorObject => ({
  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
  stops: [
    [0, withAlpha(color, 0.28)],
    [1, withAlpha(color, 0)],
  ],
});

const lakh = (value: number) => '৳' + value.toLocaleString('en-IN') + 'L';

export function volumeChart(data: DashboardData): Highcharts.Options {
  return {
    ...common,
    chart: baseChart(300, 'areaspline'),
    xAxis: {
      categories: data.labels,
      tickInterval: Math.max(1, Math.ceil(data.labels.length / 7)),
      lineWidth: 0,
      tickWidth: 0,
      labels: { style: axisLabel },
    },
    yAxis: {
      title: { text: undefined },
      gridLineColor: PALETTE.grid,
      labels: {
        style: axisLabel,
        formatter() {
          return lakh(this.value as number);
        },
      },
    },
    legend: {
      align: 'right',
      verticalAlign: 'top',
      itemStyle: { color: PALETTE.muted, fontWeight: '500', fontSize: '12px' },
      symbolRadius: 6,
    },
    tooltip: {
      ...tooltip,
      shared: true,
      formatter(this: any) {
        const rows = this.points
          .map((p: any) => `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${lakh(p.y)}</b>`)
          .join('<br/>');
        return `<b>${this.x}</b><br/>${rows}`;
      },
    },
    plotOptions: {
      ...common.plotOptions,
      areaspline: {
        lineWidth: 2.5,
        marker: { enabled: false, symbol: 'circle', states: { hover: { enabled: true, radius: 5 } } },
      },
    },
    series: [
      { id: 'domestic', type: 'areaspline', name: 'Domestic', color: PALETTE.primary, fillColor: gradient(PALETTE.primary), data: data.domestic },
      { id: 'international', type: 'areaspline', name: 'International', color: PALETTE.amber, fillColor: gradient(PALETTE.amber), data: data.international },
    ],
  };
}

export function donutChart(
  points: { name: string; y: number; color: string }[],
  seriesName: string,
): Highcharts.Options {
  return {
    ...common,
    chart: { ...baseChart(190, 'pie'), margin: [0, 0, 0, 0], spacing: [0, 0, 0, 0] },
    tooltip: {
      ...tooltip,
      pointFormat: '<b>{point.y:,.0f}</b> ({point.percentage:.1f}%)',
    },
    plotOptions: {
      ...common.plotOptions,
      pie: {
        innerSize: '76%',
        borderWidth: 4,
        borderColor: PALETTE.surface,
        borderRadius: 6,
        dataLabels: { enabled: false },
        states: { hover: { halo: { size: 6 } } },
      },
    },
    series: [{ id: seriesName, type: 'pie', name: seriesName, data: points }],
  };
}

export function hoursChart(data: DashboardData): Highcharts.Options {
  const peak = Math.max(...data.hours);
  return {
    ...common,
    chart: baseChart(300, 'column'),
    xAxis: {
      categories: data.hours.map((_, hour) => `${hour.toString().padStart(2, '0')}:00`),
      tickInterval: 3,
      lineWidth: 0,
      tickWidth: 0,
      labels: { style: axisLabel },
    },
    yAxis: {
      title: { text: undefined },
      gridLineColor: PALETTE.grid,
      labels: {
        style: axisLabel,
        formatter() {
          return (this.value as number) >= 1000 ? (this.value as number) / 1000 + 'K' : String(this.value);
        },
      },
    },
    legend: { enabled: false },
    tooltip: { ...tooltip, pointFormat: '<b>{point.y:,.0f}</b> transactions' },
    plotOptions: {
      ...common.plotOptions,
      column: { borderRadius: 4, pointPadding: 0.08, groupPadding: 0.04, borderWidth: 0 },
    },
    series: [
      {
        id: 'hours',
        type: 'column',
        name: 'Transactions',
        data: data.hours.map((y) => ({ y, color: y === peak ? PALETTE.amber : '#93B4F5' })),
      },
    ],
  };
}

export function categoriesChart(data: DashboardData): Highcharts.Options {
  return {
    ...common,
    chart: baseChart(280, 'bar'),
    xAxis: {
      categories: data.categories.map((c) => c.name),
      lineWidth: 0,
      tickWidth: 0,
      labels: { style: { ...axisLabel, color: PALETTE.ink, fontSize: '13px' } },
    },
    yAxis: { visible: false, max: 34 },
    legend: { enabled: false },
    tooltip: { ...tooltip, pointFormat: '<b>{point.y}%</b> of spend' },
    plotOptions: {
      ...common.plotOptions,
      bar: {
        borderRadius: 5,
        pointWidth: 16,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{y}%',
          style: { color: PALETTE.ink, fontWeight: '600', fontSize: '12px', textOutline: 'none' },
        },
      },
    },
    series: [
      {
        id: 'categories',
        type: 'bar',
        name: 'Share of spend',
        data: data.categories.map((c, i) => ({ y: c.share, color: i === 0 ? PALETTE.primary : '#6F94E8' })),
      },
    ],
  };
}

export function binsChart(data: DashboardData): Highcharts.Options {
  return {
    ...common,
    chart: baseChart(300, 'bar'),
    xAxis: {
      categories: data.bins,
      lineWidth: 0,
      tickWidth: 0,
      labels: { style: { ...axisLabel, fontFamily: "'Fira Code', monospace" } },
    },
    yAxis: {
      min: 0,
      title: { text: undefined },
      gridLineColor: PALETTE.grid,
      labels: {
        style: axisLabel,
        formatter() {
          return (this.value as number) / 1000 + 'K';
        },
      },
    },
    legend: {
      align: 'left',
      verticalAlign: 'top',
      itemStyle: { color: PALETTE.muted, fontWeight: '500', fontSize: '12px' },
      symbolRadius: 3,
    },
    tooltip: { ...tooltip, shared: true },
    plotOptions: {
      ...common.plotOptions,
      series: { ...common.plotOptions?.series, stacking: 'normal', borderWidth: 0 },
      bar: { pointWidth: 18 },
    },
    series: [
      { id: 'debit', type: 'bar', name: 'Debit', color: PALETTE.primary, data: data.binMix.debit },
      { id: 'prepaid', type: 'bar', name: 'Prepaid', color: PALETTE.sky, data: data.binMix.prepaid },
      { id: 'credit', type: 'bar', name: 'Credit', color: PALETTE.amber, data: data.binMix.credit },
    ],
  };
}
