import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnirseSala } from './unirse-sala';

describe('UnirseSala', () => {
  let component: UnirseSala;
  let fixture: ComponentFixture<UnirseSala>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnirseSala]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnirseSala);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
