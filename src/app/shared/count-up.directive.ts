import { Directive, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';

@Directive({
  selector: '[countUp]',
  standalone: true,
})
export class CountUpDirective implements OnChanges, OnDestroy {
  @Input({ required: true }) countUp = 0;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() decimals = 0;
  @Input() compact = false;
  @Input() duration = 1100;

  private current = 0;
  private frame = 0;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(): void {
    cancelAnimationFrame(this.frame);

    const target = this.countUp;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || this.duration <= 0) {
      this.render(target);
      return;
    }

    const from = this.current;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / this.duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.render(from + (target - from) * eased);
      if (progress < 1) {
        this.frame = requestAnimationFrame(step);
      }
    };
    this.frame = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
  }

  private render(value: number): void {
    this.current = value;
    this.el.nativeElement.textContent = `${this.prefix}${this.format(value)}${this.suffix}`;
  }

  // Bangladesh style: lakh (L) and crore (Cr), with lakh/crore digit grouping.
  private format(value: number): string {
    if (this.compact && value >= 1e7) {
      return `${(value / 1e7).toFixed(this.decimals)} Cr`;
    }
    if (this.compact && value >= 1e5) {
      return `${(value / 1e5).toFixed(this.decimals)} L`;
    }
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: this.compact ? 0 : this.decimals,
      maximumFractionDigits: this.compact ? 0 : this.decimals,
    });
  }
}
