import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketRedirectVideochatComponent } from './ticket-redirect-videochat.component';

describe('TicketRedirectVideochatComponent', () => {
  let component: TicketRedirectVideochatComponent;
  let fixture: ComponentFixture<TicketRedirectVideochatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketRedirectVideochatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketRedirectVideochatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
