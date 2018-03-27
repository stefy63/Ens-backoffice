import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVideochatComponent } from './user-videochat.component';

describe('UserVideochatComponent', () => {
  let component: UserVideochatComponent;
  let fixture: ComponentFixture<UserVideochatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserVideochatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserVideochatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
