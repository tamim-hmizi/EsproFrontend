import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchAxisComponent } from './ResearchAxis.component';

describe('ResearchAxisComponent', () => {
  let component: ResearchAxisComponent;
  let fixture: ComponentFixture<ResearchAxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchAxisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResearchAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
