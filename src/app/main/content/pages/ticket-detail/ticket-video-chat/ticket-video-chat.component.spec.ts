import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketVideoChatComponent } from './ticket-video-chat.component';

describe('TicketVideoChatComponent', () => {
  let component: TicketVideoChatComponent;
  let fixture: ComponentFixture<TicketVideoChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketVideoChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketVideoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
