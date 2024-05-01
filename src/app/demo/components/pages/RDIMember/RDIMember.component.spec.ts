import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RDIMemberComponent } from './RDIMember.Component'; // Adjust the import path to match your component file

describe('RDIMemberComponent', () => { // Update the component name
  let component: RDIMemberComponent; // Update the component reference
  let fixture: ComponentFixture<RDIMemberComponent>; // Update the component reference

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RDIMemberComponent ] // Update the component reference
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RDIMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
