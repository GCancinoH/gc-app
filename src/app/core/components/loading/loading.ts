import { NgClass, NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';
import { Styles } from '../layout/layout.component';

type Loaders = 'pulse' | 'basic' | 'scale-up' | 'dots-rotation' | 'dots-spin';

@Component({
  selector: 'Loading',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './loading.html',
  styleUrl: './loading.scss'
})
export class ComposeLoading 
{
  loader = input<Loaders>('basic');
  styles = input<Styles>();
  activated = input<boolean>(false);

}
