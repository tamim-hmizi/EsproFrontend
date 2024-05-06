import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RDIComponent } from './rdi.component';

describe('RDIComponent', () => {
  let component: RDIComponent;
  let fixture: ComponentFixture<RDIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RDIComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RDIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
