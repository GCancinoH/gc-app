import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTransform',
})
export class DateTransformPipe extends DatePipe implements PipeTransform {

  override transform(value: any, args?: any): any {
      return super.transform(value, 'MMMM dd, yyy', 'es-ES', 'es');
  }


}

