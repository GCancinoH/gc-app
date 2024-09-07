import { Component, OnInit, effect, input } from '@angular/core';

@Component({
  selector: 'loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class ComposeLoading implements OnInit {
  // input, output
  text = input<string>('');
  image = input<string>('');
  // variables
  path: string = '';

  ngOnInit() {
    if(this.image() != null) {
      this.path = `images/lottie/${this.image()}.json`;
    }
  }
}
