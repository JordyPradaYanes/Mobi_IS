import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRentalsComponent } from './user-rentals.component';

describe('UserRentalsComponent', () => {
  let component: UserRentalsComponent;
  let fixture: ComponentFixture<UserRentalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRentalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRentalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
