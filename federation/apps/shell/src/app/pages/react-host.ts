import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, type UrlMatchResult, type UrlSegment } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { filter } from 'rxjs';

/** Contract exposed by the React remote as "./mount". */
export interface ReactAppHandle {
  update(url: string): void;
  unmount(): void;
}

export interface ReactRemote {
  mount(element: HTMLElement, options: { basePath: string; url: string }): ReactAppHandle;
}

export const REACT_BASE_PATH = '/react-app';

/** Matches /react-app and every nested URL; the React remote owns everything below it. */
export function reactMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  return segments[0]?.path === 'react-app' ? { consumed: segments } : null;
}

@Component({
  selector: 'app-react-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (error()) {
      <div class="demo-card">Could not load the React remote: {{ error() }}</div>
    }
    <div #host></div>
  `,
})
export class ReactHost {
  private readonly router = inject(Router);
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private handle?: ReactAppHandle;
  private destroyed = false;

  protected readonly error = signal('');

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.handle?.update(event.urlAfterRedirects));

    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.handle?.unmount();
    });

    afterNextRender(() => void this.load());
  }

  private async load(): Promise<void> {
    try {
      const remote = await loadRemoteModule<ReactRemote>('react-app', './mount');
      if (this.destroyed) {
        return;
      }
      this.handle = remote.mount(this.host().nativeElement, {
        basePath: REACT_BASE_PATH,
        url: this.router.url,
      });
    } catch (e) {
      this.error.set(String(e));
    }
  }
}
