import { Injectable } from '@angular/core';

export interface RemoteDefinition {
  tag: string;
  url: string;
  basePath: string;
}

/**
 * Remotes are described by a runtime manifest (public/remotes.json), so a remote can be
 * redeployed or moved without rebuilding the shell.
 */
@Injectable({ providedIn: 'root' })
export class RemoteRegistry {
  private remotes: Record<string, RemoteDefinition> = {};
  private readonly loading = new Map<string, Promise<void>>();

  async init(): Promise<void> {
    this.remotes = await (await fetch('remotes.json')).json();
  }

  get(name: string): RemoteDefinition {
    const remote = this.remotes[name];
    if (!remote) {
      throw new Error(`Unknown remote "${name}"`);
    }
    return remote;
  }

  /** Loads the remote's script once; it registers its custom element as a side effect. */
  load(name: string): Promise<void> {
    const remote = this.get(name);
    let promise = this.loading.get(name);
    if (!promise) {
      promise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = remote.url;
        script.onload = () => resolve();
        script.onerror = () => {
          this.loading.delete(name);
          reject(new Error(`Could not load ${remote.url}`));
        };
        document.head.appendChild(script);
      });
      this.loading.set(name, promise);
    }
    return promise;
  }
}
