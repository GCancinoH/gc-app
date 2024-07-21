import { Component, output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'dashboard-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule, MatIconButton, MatIcon, MatMenuModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class DashboardToolbar {
  isCollapsed = output<boolean>();
  collapsed = signal<boolean>(false);

  toggleCollapsed() {
    this.collapsed.set(!this.collapsed());
    this.isCollapsed.emit(this.collapsed());
  }
}
