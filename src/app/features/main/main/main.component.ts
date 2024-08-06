import { Component } from '@angular/core';
import { MainHeader } from './header/header.component';
import { MainHero } from './hero/hero.component';
import { MainPricing } from './pricing/pricing.component';

@Component({
  selector: 'gc-main',
  standalone: true,
  imports: [
    MainHeader, MainHero, MainPricing
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
