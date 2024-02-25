import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Credentials } from '../../models/credentials.interface';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss'
})
export class LoginDialogComponent {
  private dialogRef: MatDialogRef<LoginDialogComponent> = inject(MatDialogRef<LoginDialogComponent>)

  protected loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  protected login(): void {
    const form = this.loginForm.value;
    const user: Credentials = {
      email: form.email,
      password: form.password
    }
    this.dialogRef.close(user);
  }

  protected cancel(): void {
    this.dialogRef.close(null);
  }
}
