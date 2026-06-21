import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { RepeatTypeComponent } from '../../shared/repeat-type.component';
import { BankingForm } from './banking-form';

describe('BankingForm', () => {
  let component: BankingForm;
  let fixture: ComponentFixture<BankingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BankingForm,
        FormlyModule.forRoot({
          types: [{ name: 'repeat', component: RepeatTypeComponent }]
        }),
        FormlyMaterialModule,
        NoopAnimationsModule
      ],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
