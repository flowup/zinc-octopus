import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAnimationComponent } from './transfer-animation.component';

describe('TransferAnimationComponent', () => {
  let component: TransferAnimationComponent;
  let fixture: ComponentFixture<TransferAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferAnimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
