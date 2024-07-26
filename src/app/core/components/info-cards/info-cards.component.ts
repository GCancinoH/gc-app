import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type InfoCardType = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'InfoCard',
  standalone: true,
  imports: [
    NgClass, MatIcon
  ],
  templateUrl: './info-cards.component.html',
  styleUrl: './info-cards.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 1
      })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ])
  ]
})
export class ComposeInfoCard {
  text = input<string>('');
  type = input<InfoCardType>('success');
}
