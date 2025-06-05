import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizTresPage } from './quiz-tres.page';

describe('QuizTresPage', () => {
  let component: QuizTresPage;
  let fixture: ComponentFixture<QuizTresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizTresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
