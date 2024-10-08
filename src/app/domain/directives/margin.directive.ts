import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[gcMargin]',
  standalone: true
})
export class MarginDirective implements OnChanges {
  @Input('gcMargin') marginConfig: string = '';

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['marginConfig']) {
      this.updateMargin();
    }
  }

  private updateMargin() {
    const [direction, value] = this.marginConfig.split(',').map(item => item.trim());
    
    if (direction && value) {
      const marginValue = isNaN(Number(value)) ? value : `${value}px`;
      
      switch (direction.toLowerCase()) {
        case 'left':
          this.el.nativeElement.style.marginLeft = marginValue;
          break;
        case 'right':
          this.el.nativeElement.style.marginRight = marginValue;
          break;
        case 'top':
          this.el.nativeElement.style.marginTop = marginValue;
          break;
        case 'bottom':
          this.el.nativeElement.style.marginBottom = marginValue;
          break;
        case 'all':
          this.el.nativeElement.style.margin = marginValue;
          break;
        default:
          console.warn(`Invalid margin direction: ${direction}`);
      }
    } else {
      console.warn('Invalid margin configuration');
    }
  }
}