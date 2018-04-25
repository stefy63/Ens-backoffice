import { TestBed, async, inject } from '@angular/core/testing';

import { IsOperatorGuard } from './is-operator.guard';

describe('OperatorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsOperatorGuard]
    });
  });

  it('should ...', inject([IsOperatorGuard], (guard: IsOperatorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
