import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizUnoPage } from './quiz-uno.page';

describe('QuizUnoPage', () => {
  let component: QuizUnoPage;
  let fixture: ComponentFixture<QuizUnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizUnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
