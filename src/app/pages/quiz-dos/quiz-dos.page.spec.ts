import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizDosPage } from './quiz-dos.page';

describe('QuizDosPage', () => {
  let component: QuizDosPage;
  let fixture: ComponentFixture<QuizDosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizDosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
