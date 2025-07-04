import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Set to false to update translations when language changes
})
export class TranslatePipe implements PipeTransform {
  // injectors
  translationService = inject(TranslationService);

  transform(key: string, ...args: any[]): string {
    let translation!: string;
    
    if(key.includes("CATEGORY_")) {
      translation = this.translationService.getTranslation(`user.progress.category.${key}`);
    } else if(key.includes("STRENGTH_")) {
      translation = this.translationService.getTranslation(`user.quests.strength.${key}`);
    } else {
      translation = this.translationService.getTranslation(key);
    }
    // const translation = this.translationService.getTranslation(key);
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