import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSala } from './crear-sala';

describe('CrearSala', () => {
  let component: CrearSala;
  let fixture: ComponentFixture<CrearSala>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearSala]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearSala);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
