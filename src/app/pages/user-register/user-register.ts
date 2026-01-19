import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

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
  ],
  templateUrl: './user-register.html',
  styleUrls: ['./user-register.scss'],
})
export class UserRegister {
  form = new FormGroup({});
  model = {};

  showSuccessMessage = false;
  showErrorMessage = false;

  fields: FormlyFieldConfig[] = [
    { template: '<h3>Hotel Information</h3>' },

    {
      key: 'hotelName',
      type: 'input',
      templateOptions: {
        label: 'Hotel Name',
        placeholder: 'Enter hotel name',
        required: true,
      },
    },

    {
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
      },
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
      },
    },

    {
      key: 'description',
      type: 'textarea',
      templateOptions: { label: 'Description' },
    },

    { template: '<h3>Address</h3>' },

    {
      key: 'country',
      type: 'input',
      templateOptions: { label: 'Country', required: true },
    },

    {
      key: 'city',
      type: 'input',
      templateOptions: { label: 'City', required: true },
    },

    {
      key: 'address',
      type: 'textarea',
      templateOptions: { label: 'Full Address', required: true },
    },

    { template: '<h3>Owner Information</h3>' },

    {
      key: 'ownerName',
      type: 'input',
      templateOptions: { label: 'Owner Name', required: true },
    },

    {
      key: 'email',
      type: 'input',
      templateOptions: { label: 'Email', type: 'email', required: true },
    },

    {
      key: 'phone',
      type: 'input',
      templateOptions: { label: 'Phone', type: 'number', required: true },
    },

    { template: '<h3>Room Info</h3>' },

    {
      key: 'totalRooms',
      type: 'input',
      templateOptions: { label: 'Total Rooms', type: 'number', required: true },
    },

    {
      key: 'ac',
      type: 'checkbox',
      templateOptions: { label: 'AC Available' },
    },

    {
      key: 'price',
      type: 'input',
      templateOptions: { label: 'Price per Night', type: 'number', required: true },
    },

    {
      key: 'facilities',
      type: 'multicheckbox',
      templateOptions: {
        label: 'Facilities',
        options: [
          { label: 'Wifi', value: 'wifi' },
          { label: 'Swimming Pool', value: 'pool' },
          { label: 'Gym', value: 'gym' },
        ],
      },
    },

    {
      key: 'agree',
      type: 'checkbox',
      templateOptions: { label: 'I agree terms & conditions', required: true },
    },
  ];

  submit() {
    if (this.form.valid) {
      // alert(JSON.stringify(this.model));
      alert(JSON.stringify(this.model));

      this.showSuccessMessage = true;
      this.showErrorMessage = false;
    } else {
      this.showErrorMessage = true;
      this.showSuccessMessage = false;
    }
  }
}
