import Lenis from 'lenis';

export class SmoothContainerScroll {
  private lenis: Lenis | null = null;
  private container: HTMLElement | null = null;
  private rafId: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init() {
    if (!this.container) return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wrapper: this.container,
      content: this.container,
    });

    const raf = (time: number) => {
      if (this.lenis) {
        this.lenis.raf(time);
        this.rafId = requestAnimationFrame(raf);
      }
    };

    this.rafId = requestAnimationFrame(raf);
  }

  public scrollTo(target: number | HTMLElement, options?: any) {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    }
  }

  public destroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public stop() {
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  public start() {
    if (this.lenis) {
      this.lenis.start();
    }
  }
}