import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalDetailComponent } from './approval-detail.component';

describe('ApprovalDetailComponent', () => {
  let component: ApprovalDetailComponent;
  let fixture: ComponentFixture<ApprovalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
