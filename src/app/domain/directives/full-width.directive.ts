import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[gcFullWidth]',
  standalone: true
})
export class FullWidthDirective {
  // injectors
  private readonly el = inject(ElementRef);
  private readonly render = inject(Renderer2);
  
  constructor() { 
    this.setFullWidth();
   }

  private setFullWidth() {
    this.render.setStyle(this.el.nativeElement,'width','100%');
  }



}
