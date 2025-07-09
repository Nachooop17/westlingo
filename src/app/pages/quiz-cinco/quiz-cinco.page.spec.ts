import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizCincoPage } from './quiz-cinco.page';

describe('QuizCincoPage', () => {
  let component: QuizCincoPage;
  let fixture: ComponentFixture<QuizCincoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizCincoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
