import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyBillsComponent } from './monthly-bills.component';

describe('MonthlyBillsComponent', () => {
  let component: MonthlyBillsComponent;
  let fixture: ComponentFixture<MonthlyBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyBillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
