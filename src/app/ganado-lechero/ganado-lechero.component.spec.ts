import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadoLecheroComponent } from './ganado-lechero.component';

describe('GanadoLecheroComponent', () => {
  let component: GanadoLecheroComponent;
  let fixture: ComponentFixture<GanadoLecheroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GanadoLecheroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GanadoLecheroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
