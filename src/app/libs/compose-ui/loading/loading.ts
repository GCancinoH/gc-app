import { Component, OnInit, input } from '@angular/core';
// Other
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'loading',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './loading.html',
  styleUrl: './loading.css'
})
export class ComposeLoading implements OnInit {
  // input, output
  text = input<string>('');
  image = input<string>('');
  // variables
  path: string = '';
  options!: AnimationOptions;

  ngOnInit() {
    if(this.image() != null) {
      this.path = `images/lottie/${this.image()}.json`;
      this.options = {
        path: this.path,
      };
    }
  }
}
