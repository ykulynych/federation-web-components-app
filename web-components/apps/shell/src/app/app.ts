import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ShellPlatformSdk } from './platform/shell-platform-sdk';
import { ShellSettings } from './platform/shell-settings';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatListModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly sdk = inject(ShellPlatformSdk);
  protected readonly settings = inject(ShellSettings);

  protected toggleTheme(): void {
    this.sdk.setTheme(this.sdk.theme() === 'light' ? 'dark' : 'light');
  }
}
