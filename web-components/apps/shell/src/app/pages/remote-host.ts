import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { PlatformElement, ShadowMode } from '@demo/platform-sdk';
import { RemoteRegistry } from '../platform/remote-registry';
import { ShellPlatformRouter } from '../platform/shell-platform-router';
import { ShellPlatformSdk } from '../platform/shell-platform-sdk';
import { ShellSettings } from '../platform/shell-settings';

/** Renders the remote's custom element; it is the only thing the shell knows about a remote. */
@Component({
  selector: 'app-remote-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (error()) {
      <div class="demo-card">Could not load the remote: {{ error() }}</div>
    }
    <div #host></div>
  `,
})
export class RemoteHost {
  private readonly name = inject(ActivatedRoute).snapshot.data['remote'] as string;
  private readonly registry = inject(RemoteRegistry);
  private readonly sdk = inject(ShellPlatformSdk);
  private readonly platformRouter = inject(ShellPlatformRouter);
  private readonly settings = inject(ShellSettings);
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private renderId = 0;

  protected readonly error = signal('');

  constructor() {
    afterRenderEffect(() => {
      const mode = this.settings.shadowMode();
      const host = this.host().nativeElement;
      untracked(() => void this.render(host, mode));
    });
    inject(DestroyRef).onDestroy(() => this.renderId++);
  }

  private async render(host: HTMLElement, mode: ShadowMode): Promise<void> {
    const id = ++this.renderId;
    host.replaceChildren();
    try {
      await this.registry.load(this.name);
    } catch (e) {
      this.error.set(String(e));
      return;
    }
    if (id !== this.renderId) {
      return;
    }
    const { tag, basePath } = this.registry.get(this.name);
    const element = document.createElement(tag) as PlatformElement;
    element.platformSdk = this.sdk;
    element.router = this.platformRouter;
    element.setAttribute('base-path', basePath);
    element.setAttribute('shadow', mode);
    host.appendChild(element);
  }
}
