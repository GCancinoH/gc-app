import { ChangeDetectionStrategy, Directive, ElementRef, Renderer2, inject, input } from "@angular/core";

@Directive({
    selector: 'layoutGap',
    standalone: true,
})
export class LayoutGapDirective {
    // Injects
    element = inject(ElementRef);
    renderer = inject(Renderer2);
    // Inputs
    gap = input<string>();

    constructor() {
        this.renderer.setStyle(this.element.nativeElement, 'gap', this.gap());
    }
}