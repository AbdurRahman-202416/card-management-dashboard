import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserRegister } from './user-register';

describe('UserRegister', () => {
  let component: UserRegister;
  let fixture: ComponentFixture<UserRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRegister, FormlyModule.forRoot(), FormlyMaterialModule, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
