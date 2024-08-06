import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

type PricingScheme = {
  name: string;
  price: number;
  features: string[],
  wanted?: boolean
}

@Component({
  selector: 'gc-main-pricing',
  standalone: true,
  imports: [NgFor],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css',
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('1s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
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
  ]

}
