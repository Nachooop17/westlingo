import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizFinalRedirectorPage } from './quiz-final-redirector.page';

describe('QuizFinalRedirectorPage', () => {
  let component: QuizFinalRedirectorPage;
  let fixture: ComponentFixture<QuizFinalRedirectorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizFinalRedirectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
