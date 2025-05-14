import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloLocal1Page } from './modulo-local-1.page';

describe('ModuloLocal1Page', () => {
  let component: ModuloLocal1Page;
  let fixture: ComponentFixture<ModuloLocal1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloLocal1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
