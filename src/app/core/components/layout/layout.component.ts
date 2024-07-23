import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass, NgStyle } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutGapDirective } from './layout.directive';

type DirectionType = 'row' | 'column' | 'responsive';
export interface Styles {
  [key: string]: string;
}

@Component({
  selector: 'Layout',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class ComposeLayout extends LayoutGapDirective implements OnInit {
  // Injects
  breakPoint = inject(BreakpointObserver);
  // Inputs
  direction = input<DirectionType>();
  styles = input<Styles>();
  // Variables
  currentDirection = signal<DirectionType>('row');  

  ngOnInit(): void {
    if (this.direction() === 'responsive') {
      this.breakPoint.observe([
        Breakpoints.HandsetPortrait,
        Breakpoints.TabletPortrait,
        Breakpoints.WebPortrait
      ]).subscribe(result => {
        if (result.matches) {
          console.log(result.breakpoints);
          if (result.breakpoints[Breakpoints.HandsetPortrait]) {
            this.currentDirection.set('column');
          } else if (result.breakpoints[Breakpoints.TabletPortrait]) {
            this.currentDirection.set('row');
          } else if (result.breakpoints[Breakpoints.WebPortrait]) {
            this.currentDirection.set('row');
          }
        }
      });
    }
  }
}
