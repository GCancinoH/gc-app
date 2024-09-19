import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialBodyCompositionComponent } from './initial-body-composition.component';

describe('InitialBodyCompositionComponent', () => {
  let component: InitialBodyCompositionComponent;
  let fixture: ComponentFixture<InitialBodyCompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialBodyCompositionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitialBodyCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
