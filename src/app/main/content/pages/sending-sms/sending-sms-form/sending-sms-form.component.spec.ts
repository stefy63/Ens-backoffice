import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendingSmsFormComponent } from './sending-sms-form.component';

describe('SendingSmsFormComponent', () => {
  let component: SendingSmsFormComponent;
  let fixture: ComponentFixture<SendingSmsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendingSmsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendingSmsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
