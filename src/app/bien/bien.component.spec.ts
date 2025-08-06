import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienComponent } from './bien.component';

describe('BienComponent', () => {
  let component: BienComponent;
  let fixture: ComponentFixture<BienComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BienComponent]
    });
    fixture = TestBed.createComponent(BienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
