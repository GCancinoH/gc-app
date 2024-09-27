import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[materialOutlined]',
  standalone: true
})
export class MaterialOutlinedDirective {
  // injectors
  private readonly el = inject(ElementRef);
  private readonly render = inject(Renderer2);

  constructor() { this.setMaterialClass(); }

  private setMaterialClass() {
    this.render.addClass(this.el.nativeElement,'material-symbols-outlined');
  }

}
