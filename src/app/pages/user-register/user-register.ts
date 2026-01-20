import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-register',
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
  templateUrl: './user-register.html',
  styleUrls: ['./user-register.scss'],
})
export class UserRegister {
  form: FormGroup;
  model = {};

  showSuccessMessage = false;
  showErrorMessage = false;

  fields: FormlyFieldConfig[] = [
    {
      template: '<div class="section-title"><h3>Hotel Information</h3></div>',
    },
    {
      fieldGroupClassName: 'display-flex',
      fieldGroup: [
        {
          className: 'flex-1',
          key: 'hotelName',
          type: 'input',
          templateOptions: {
            label: 'Hotel Name',
            placeholder: 'Enter hotel name',
            required: true,
            appearance: 'outline',
          },
        },
        {
          className: 'flex-1',
          key: 'hotelType',
          type: 'select',
          templateOptions: {
            label: 'Hotel Type',
            options: [
              { label: 'Resort', value: 'resort' },
              { label: 'Apartment', value: 'apartment' },
              { label: 'Hotel', value: 'hotel' },
            ],
            required: true,
            appearance: 'outline',
          },
        },
      ],
    },
    {
      key: 'rating',
      type: 'select',
      templateOptions: {
        label: 'Star Rating',
        options: [
          { label: '1 Star', value: 1 },
          { label: '2 Star', value: 2 },
          { label: '3 Star', value: 3 },
          { label: '4 Star', value: 4 },
          { label: '5 Star', value: 5 },
        ],
        required: true,
        appearance: 'outline',
      },
    },
    {
      key: 'description',
      type: 'textarea',
      templateOptions: {
        label: 'Description',
        rows: 3,
        appearance: 'outline',
      },
    },

    {
      template: '<div class="section-title"><h3>Address</h3></div>',
    },
    {
      fieldGroupClassName: 'display-flex',
      fieldGroup: [
        {
          className: 'flex-1',
          key: 'country',
          type: 'input',
          templateOptions: { label: 'Country', required: true, appearance: 'outline' },
        },
        {
          className: 'flex-1',
          key: 'city',
          type: 'input',
          templateOptions: { label: 'City', required: true, appearance: 'outline' },
        },
      ],
    },
    {
      key: 'address',
      type: 'textarea',
      templateOptions: { label: 'Full Address', required: true, rows: 2, appearance: 'outline' },
    },

    {
      template: '<div class="section-title"><h3>Owner Information</h3></div>',
    },
    {
      key: 'ownerName',
      type: 'input',
      templateOptions: { label: 'Owner Name', required: true, appearance: 'outline' },
    },
    {
      fieldGroupClassName: 'display-flex',
      fieldGroup: [
        {
          className: 'flex-1',
          key: 'email',
          type: 'input',
          templateOptions: { label: 'Email', type: 'email', required: true, appearance: 'outline' },
        },
        {
          className: 'flex-1',
          key: 'phone',
          type: 'input',
          templateOptions: { label: 'Phone', type: 'tel', required: true, appearance: 'outline' },
        },
      ],
    },

    {
      template: '<div class="section-title"><h3>Room Info</h3></div>',
    },
    {
      fieldGroupClassName: 'display-flex',
      fieldGroup: [
        {
          className: 'flex-1',
          key: 'totalRooms',
          type: 'input',
          templateOptions: {
            label: 'Total Rooms',
            type: 'number',
            required: true,
            appearance: 'outline',
          },
        },
        {
          className: 'flex-1',
          key: 'price',
          type: 'input',
          templateOptions: {
            label: 'Price per Night',
            type: 'number',
            required: true,
            appearance: 'outline',
          },
        },
      ],
    },
    {
      key: 'ac',
      type: 'checkbox',
      templateOptions: { label: 'AC Available' },
    },

    // Note: multicheckbox might require extra configuration or a custom type.
    // Keeping it as is but be aware it might need a custom component if not provided by FormlyMaterialModule out of the box.
    // Switching to individual checkboxes for safety if multicheckbox fails, but let's try to keep it simple first.
    // Actually, let's use a select multiple for better compatibility if multicheckbox isn't standard in the currently installed setup?
    // Let's stick to the user request "checking code" - if multicheckbox was there, maybe it works.
    // I will replace it with a select multiple which is standard Material.
    {
      key: 'facilities',
      type: 'select',
      templateOptions: {
        label: 'Facilities',
        multiple: true,
        options: [
          { label: 'Wifi', value: 'wifi' },
          { label: 'Swimming Pool', value: 'pool' },
          { label: 'Gym', value: 'gym' },
          { label: 'Parking', value: 'parking' },
          { label: 'Restaurant', value: 'restaurant' },
        ],
        appearance: 'outline',
      },
    },

    {
      key: 'agree',
      type: 'checkbox',
      templateOptions: { label: 'I agree to terms & conditions', required: true },
    },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  submit() {
    if (this.form.valid) {
      console.log(this.model);
      this.showSuccessMessage = true;
      this.showErrorMessage = false;
      // Ideally reset form here or navigate away
    } else {
      this.showErrorMessage = true;
      this.showSuccessMessage = false;
      this.form.markAllAsTouched();
    }
  }
}
