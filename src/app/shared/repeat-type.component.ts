import { Component } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'formly-repeat-section',
  standalone: true,
  imports: [CommonModule, FormlyModule, MatButtonModule, MatIconModule],
  template: `
    <div class="repeat-section-container">
      <div class="repeat-section-title" *ngIf="props.label">
        <h4>{{ props.label }}</h4>
      </div>
      <div *ngFor="let field of field.fieldGroup; let i = index" class="repeat-row">
        <div class="repeat-field-wrapper">
          <formly-field [field]="field"></formly-field>
        </div>
        <button mat-icon-button type="button" color="warn" (click)="remove(i)" class="remove-btn">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
      <div class="repeat-actions">
        <button mat-stroked-button type="button" color="primary" (click)="add()" class="add-btn">
          <mat-icon>add</mat-icon> Add {{ props.label || 'Item' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .repeat-section-container {
      margin: 16px 0;
      padding: 16px;
      border: 1px dashed #cbd5e0;
      border-radius: 8px;
      background: #f7fafc;
    }
    .repeat-section-title h4 {
      margin: 0 0 12px 0;
      color: #4a5568;
      font-size: 14px;
      font-weight: 600;
    }
    .repeat-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .repeat-field-wrapper {
      flex: 1;
    }
    .remove-btn {
      margin-bottom: 22px;
    }
    .repeat-actions {
      margin-top: 12px;
    }
  `]
})
export class RepeatTypeComponent extends FieldArrayType {}
