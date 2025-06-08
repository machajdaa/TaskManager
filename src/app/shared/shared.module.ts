import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule
  ],
  exports: [
    ConfirmDialogComponent,
    MaterialModule
  ]
})
export class SharedModule {}