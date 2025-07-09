import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizSeisPage } from './quiz-seis.page';

describe('QuizSeisPage', () => {
  let component: QuizSeisPage;
  let fixture: ComponentFixture<QuizSeisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizSeisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
