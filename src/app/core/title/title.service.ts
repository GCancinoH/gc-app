import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { config } from '../const';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  title = inject(Title);

  getTitle() {
    return this.title.getTitle();
  }

  setTitle(newTitle: string) {
    this.title.setTitle(newTitle + ' | ' + config.title);
  }
}

export function useTitleService() {
  return inject(TitleService)
}
