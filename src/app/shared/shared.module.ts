import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatTableModule } from '@angular/material/table';
import {  MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    MatDialogModule,
    TranslateModule
  ],
  exports: [
    ConfirmDialogComponent,
    MaterialModule
  ]
})
export class SharedModule {}