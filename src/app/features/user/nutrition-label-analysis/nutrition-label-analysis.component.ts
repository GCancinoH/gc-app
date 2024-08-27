import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
  selector: 'gc-nutrition-label-analysis',
  standalone: true,
  imports: [
    MatIcon, MatMiniFabButton
  ],
  templateUrl: './nutrition-label-analysis.component.html',
  styleUrl: './nutrition-label-analysis.component.css'
})
export class NutritionLabelAnalysisComponent {
  // injectors
  // signals
  // inputs, outputs, viewchilds, etc
  videoElement = viewChild<ElementRef>('video');
  capturedmage = signal<string | null>(null);
  stream = signal<MediaStream | null>(null);
  // variables
  // methods
  captureImage() {

  }

  retakePhoto() {

  }

  sendToServer() {

  }

}
