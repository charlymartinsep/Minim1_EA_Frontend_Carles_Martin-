import { TestBed } from '@angular/core/testing';

import { ComentariService } from './comentari.service';

describe('ComentariService', () => {
  let service: ComentariService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComentariService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
