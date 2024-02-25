import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Credentials } from '../../models/credentials.interface';

@Component({
  selector: 'app-signin-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './signin-dialog.component.html',
  styleUrl: './signin-dialog.component.scss'
})
export class SigninDialogComponent {

  private matDialogRef: MatDialogRef<SigninDialogComponent> = inject(MatDialogRef<SigninDialogComponent>)

  protected signInForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl('')
  })

  protected signIn(): void {
    const form = this.signInForm.value;
    const credentials: Credentials = {
      email: form.email,
      password: form.password
    }

    this.matDialogRef.close(credentials);
  }

  protected cancel(): void {
    this.matDialogRef.close(null)
  }
}
