import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadoEngordeComponent } from './ganado-engorde.component';

describe('GanadoEngordeComponent', () => {
  let component: GanadoEngordeComponent;
  let fixture: ComponentFixture<GanadoEngordeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GanadoEngordeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GanadoEngordeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
