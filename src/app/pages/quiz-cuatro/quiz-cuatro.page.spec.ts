import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizCuatroPage } from './quiz-cuatro.page';

describe('QuizCuatroPage', () => {
  let component: QuizCuatroPage;
  let fixture: ComponentFixture<QuizCuatroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizCuatroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
