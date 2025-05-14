import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SublevelPage } from './sublevel.page';

describe('SublevelPage', () => {
  let component: SublevelPage;
  let fixture: ComponentFixture<SublevelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SublevelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
