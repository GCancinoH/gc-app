import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'gc-main-header',
  standalone: true,
  imports: [
    MatToolbarModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class MainHeader {

}
