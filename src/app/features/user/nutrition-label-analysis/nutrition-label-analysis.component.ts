import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Material
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { Observable, Subject, from, map, of, tap } from 'rxjs';

@Component({
  selector: 'gc-nutrition-label-analysis',
  standalone: true,
  imports: [
    AsyncPipe,
    MatIcon, MatMiniFabButton, MatFabButton, MatButton
  ],
  templateUrl: './nutrition-label-analysis.component.html',
  styleUrl: './nutrition-label-analysis.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutritionLabelAnalysisComponent implements OnInit, OnDestroy {
  // injectors
  destroyRef = inject(DestroyRef);
  http = inject(HttpClient);
  // signals
  // inputs, outputs, viewchilds, etc
  videoElement = viewChild<ElementRef<HTMLVideoElement>>('video');
  // observables
  capturedImage$ = new Subject<string>;
  // variables
  private stream: MediaStream | null = null;
  capturedImage: string | null = null;
  // methods
  ngOnInit(): void {
    this.startCamera().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (stream) => {
        this.stream = stream;
      },
      error: (err) => {
        console.log('Error accesing the camera: ', err);
      }
    });

    this.capturedImage$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(image => {
      this.capturedImage = image;
    });
  } 

  ngOnDestroy(): void {
    this.stopCamera().subscribe({ 
      complete: () => console.log('Camera stopped successfully'), // Optional: Log success
      error: (error) => console.error('Error stopping camera:', error) // Handle potential errors
    });
  }

  /*
  */
  startCamera(): Observable<MediaStream> {
    return from(navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }))
      .pipe(
        tap(stream => {
          const videoEl = this.videoElement();
          if(videoEl) {
            videoEl.nativeElement.srcObject = stream;
          }
        })
      );
  }

  stopCamera(): Observable<void> {
    if (this.stream) {
      return from(this.stream.getTracks()).pipe(
        tap(track => track.stop()),
        map(() => undefined)
      );
    } else {
      return of(undefined); // Or any other suitable value to indicate no action was taken
    }
  }

  captureImage() {
    const video = this.videoElement();
    if(video) {
      const videoEl = video.nativeElement;
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(videoEl, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        this.capturedImage$.next(imageData);
        //this.capturedImage = imageData;
      }
      this.stopCamera().subscribe();
    }
  }

  retakePhoto() {
    this.capturedImage = null;
    this.startCamera().subscribe();
  }

  sendToServer() {
    if(this.captureImage != null) {
      const blob = this.dataURItoBlob(this.capturedImage!);
      const formData = new FormData();
      formData.append('image', blob, 'nutrition_label.png');

      this.http.post('http://your-flask-server-url/upload', formData)
      .subscribe({
        next: (response) => {
          console.log('Image uploaded successfully:', response);
        },
        error: (error) => {
          console.error('Error uploading image:', error);
        }
      }
      );
    }
  }

  private dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

}
