import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Set to false to update translations when language changes
})
export class TranslatePipe implements PipeTransform {
  translationService = inject(TranslationService);

  transform(key: string, ...args: any[]): string {
    const translation = this.translationService.getTranslation(key);
    if (args.length) {
      return this.interpolate(translation, args);
    }
    return translation;
  }

  private interpolate(text: string, params: any[]): string {
    return text.replace(/{(\d+)}/g, (match, index) => {
      return typeof params[index] !== 'undefined' ? params[index] : match;
    });
  }
}