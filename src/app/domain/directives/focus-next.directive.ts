import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[gcFocusNext]',
  standalone: true
})
export class FocusNextDirective {
  // injectors
  private readonly el = inject(ElementRef);
  private readonly render = inject(Renderer2);
  
  constructor() { 
    this.getFocused();
   }

  private getFocused() {
    this.el.nativeElement.focus()
  }



}