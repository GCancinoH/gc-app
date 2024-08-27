import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionLabelAnalysisComponent } from './nutrition-label-analysis.component';

describe('NutritionLabelAnalysisComponent', () => {
  let component: NutritionLabelAnalysisComponent;
  let fixture: ComponentFixture<NutritionLabelAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionLabelAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NutritionLabelAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
