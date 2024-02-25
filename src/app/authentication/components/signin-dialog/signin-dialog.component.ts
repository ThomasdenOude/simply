import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-signin-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './signin-dialog.component.html',
  styleUrl: './signin-dialog.component.scss'
})
export class SigninDialogComponent {
  private authService: AuthenticationService = inject(AuthenticationService);

  private matDialogRef: MatDialogRef<SigninDialogComponent> = inject(MatDialogRef<SigninDialogComponent>)

  protected signInForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl('')
  })

  protected signIn(): void {
    const form = this.signInForm.value;

    this.authService.creatUser(form.email, form.password);
  }

  protected cancel(): void {
    this.matDialogRef.close(null)
  }
}
