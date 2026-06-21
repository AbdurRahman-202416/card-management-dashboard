import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-banking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './banking-form.html',
  styleUrls: ['./banking-form.scss'],
})
export class BankingForm {
  form: FormGroup;
  model = {};
  http = inject(HttpClient);  

  showSuccessMessage = false; 
  showErrorMessage = false;

  fields: FormlyFieldConfig[] = [
  {
    hooks: {
      onInit: (field) => {
        // Load page config
        this.http
          .get<any>('api/customer-config')
          .subscribe((res) => {
            field.options!.formState = {
              isKycRequired: res.isKycRequired,
              isPremiumUser: res.isPremiumUser,
            };
          });
      },
    },
  },

  {
    fieldGroupClassName: 'display-flex',
    fieldGroup: [
      {
        className: 'flex-1',
        key: 'firstName',
        type: 'input',
        props: {
          label: 'First Name',
          required: true,
        },
      },

      {
        className: 'flex-1',
        key: 'lastName',
        type: 'input',
        props: {
          label: 'Last Name',
          required: true,
        },
      },
    ],
  },

  {
    fieldGroupClassName: 'display-flex',
    fieldGroup: [
      {
        className: 'flex-1',
        key: 'gender',
        type: 'select',
        props: {
          label: 'Gender',
          required: true,
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            {
              label: 'Prefer Not To Say',
              value: 'prefer_not_to_say',
            },
          ],
        },
      },

      {
        className: 'flex-1',
        key: 'dateOfBirth',
        type: 'input',

        props: {
          label: 'Date Of Birth',
          type: 'date',
          required: true,
        },

        hideExpression: (model) =>
          !model.gender ||
          model.gender === 'prefer_not_to_say',
      },
    ],
  },

  {
    fieldGroupClassName: 'display-flex',
    fieldGroup: [
      {
        className: 'flex-1',

        key: 'country',

        type: 'select',

        props: {
          label: 'Country',
          required: true,
          options: [],
        },

        hooks: {
          onInit: (field) => {
            this.http
              .get<any>('https://countriesnow.space/api/v0.1/countries')
              .subscribe((res) => {
                field.props!.options = res.data
                  .map((c: any) => ({
                    label: c.country,
                    value: c.country,
                  }))
                  .filter((c: any) => c.label && c.value)
                  .sort((a: any, b: any) => a.label.localeCompare(b.label));
              });
          },
        },
      },

      {
        className: 'flex-1',

        key: 'state',

        type: 'select',

        props: {
          label: 'State',
          options: [],
        },

        hideExpression: (model) =>
          !model.country,

        hooks: {
          onInit: (field) => {
            field.form?.get('country')
              ?.valueChanges.subscribe(
                (countryName) => {
                  if (!countryName) {
                    return;
                  }

                  this.http
                    .get<any>(
                      `https://countriesnow.space/api/v0.1/countries/states/q?country=${encodeURIComponent(countryName)}`
                    )
                    .subscribe((res) => {
                      if (res && res.data && res.data.states) {
                        field.props!.options =
                          res.data.states.map((s: any) => ({
                            label: s.name,
                            value: s.name,
                          }));
                      } else {
                        field.props!.options = [];
                      }
                    }, () => {
                      field.props!.options = [];
                    });
                }
              );
          },
        },
      },
    ],
  },

  {
    fieldGroupClassName: 'display-flex',
    fieldGroup: [
      {
        className: 'flex-1',

        key: 'occupation',

        type: 'select',

        props: {
          label: 'Occupation',

          options: [
            {
              label: 'Employed',
              value: 'employed',
            },
            {
              label: 'Self Employed',
              value: 'self_employed',
            },
            {
              label: 'Student',
              value: 'student',
            },
          ],
        },
      },

      {
        className: 'flex-1',

        key: 'companyName',

        type: 'input',

        props: {
          label: 'Company Name',
        },

        hideExpression: (model) =>
          ![
            'employed',
            'self_employed',
          ].includes(model.occupation),

        expressions: {
          'props.required': (field) =>
            [
              'employed',
              'self_employed',
            ].includes(
              field.model?.occupation
            ),
        },
      },
    ],
  },

  {
    fieldGroupClassName: 'display-flex',
    fieldGroup: [
      {
        className: 'flex-1',

        key: 'idType',

        type: 'select',

        props: {
          label: 'ID Type',

          options: [
            {
              label: 'NID',
              value: 'nid',
            },
            {
              label: 'Passport',
              value: 'passport',
            },
          ],
        },
      },

      {
        className: 'flex-1',

        key: 'idNumber',

        type: 'input',

        props: {
          label: 'ID Number',
          required: true,
        },
      },
    ],
  },

  {
    key: 'passportExpiry',

    type: 'input',

    props: {
      label: 'Passport Expiry Date',
      type: 'date',
    },

    hideExpression: (model) =>
      model.idType !== 'passport',
  },

  {
    fieldGroupClassName: 'display-flex',
    fieldGroup: [
      {
        className: 'flex-1',

        key: 'accountType',

        type: 'select',

        props: {
          label: 'Account Type',

          options: [
            {
              label: 'Savings',
              value: 'savings',
            },
            {
              label: 'Investment',
              value: 'investment',
            },
          ],
        },
      },

      {
        className: 'flex-1',

        key: 'openingDeposit',

        type: 'input',

        props: {
          label: 'Opening Deposit',
          type: 'number',
        },

        expressions: {
          'props.min': (field) =>
            field.model?.accountType ===
            'investment'
              ? 1000
              : 100,
        },

        validators: {
          minimumDeposit: {
            expression: (
              control: any,
              field: any
            ) => {
              const min =
                field?.model
                  ?.accountType ===
                'investment'
                  ? 1000
                  : 100;

              return (
                Number(control.value) >=
                min
              );
            },

            message: (
              error: any,
              field: any
            ) => {
              const currency = field?.model?.currency || 'USD';
              const min = field?.model?.accountType === 'investment' ? 1000 : 100;
              return `Minimum deposit is ${min} ${currency}.`;
            },
          },
        },
      },
    ],
  },

  {
    key: 'kycNumber',

    type: 'input',

    props: {
      label: 'KYC Number',
    },

    hideExpression: (_, field) =>
      !field.options?.formState
        ?.isKycRequired,
  },

  {
    key: 'investmentAdvice',

    type: 'checkbox',

    props: {
      label: 'Investment Advice',
    },

    hideExpression: (_, field) =>
      !field.options?.formState
        ?.isPremiumUser,
  },

  {
    key: 'phoneNumbers',

    type: 'repeat', // custom repeat type

    props: {
      label: 'Phone Numbers',
    },

    fieldArray: {
      type: 'input',

      props: {
        label: 'Phone Number',
        required: true,
      },
    },
  },
];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  submit() {
    if (this.form.valid) {
      console.log('Banking Form Submitted successfully:', this.model);
      this.showSuccessMessage = true;
      this.showErrorMessage = false;
    } else {
      this.showErrorMessage = true;
      this.showSuccessMessage = false;
      this.form.markAllAsTouched();
    }
  }
}
