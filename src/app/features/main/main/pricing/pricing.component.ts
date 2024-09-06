import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// Material
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

type PricingScheme = {
  name: string;
  price: number;
  features: string[],
  wanted?: boolean
}

@Component({
  selector: 'gc-main-pricing',
  standalone: true,
  imports: [NgClass, FormsModule, ReactiveFormsModule, MatButton, MatButtonToggleModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css',
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('1s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      state('popular', style({
        backgroundColor: '#000',
        transform: 'scale(1.03)',
        color: 'white'
      })),
      transition('* <=> popular', animate('100ms ease-in-out'))
    ]),
  ],
})
export class MainPricing {

  pricingPlans: PricingScheme[] = [
    {
      name: 'Basic',
      price: 29.99,
      features: [
        'Personalised Meal Plan',
        'Whatsapp support',
        'Bi-weekly check-ins'
      ]
    },
    {
      name: 'Premium',
      price: 64.99,
      features: [
        'Personalised Meal Plan',
        'Personalised Workout Routine',
        'Whatsapp support',
        'Weekly check-ins'
      ],
      wanted: true
    }
  ];
  timePlan = new FormControl('');

}
