import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[primaryColor]',
  standalone: true
})
export class PrimaryColorDirective {
  // injectors
  private readonly el = inject(ElementRef);
  private readonly render = inject(Renderer2);

  constructor() { 
    this.setFullWidth();
  }

  private setFullWidth() {
    this.render.setStyle(this.el.nativeElement,'background-color','#850000');
  }
}
