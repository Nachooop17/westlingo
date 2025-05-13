import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LevelDetailPage } from './level-detail.page';

describe('LevelDetailPage', () => {
  let component: LevelDetailPage;
  let fixture: ComponentFixture<LevelDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
