import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SigninDialogComponent } from '../components/signin-dialog/signin-dialog.component';
import { AuthenticationService } from '../services/authentication.service';
import { Credentials } from '../models/credentials.interface';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SigninDialogComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  private authService: AuthenticationService = inject(AuthenticationService);
  private dialog: MatDialog = inject(MatDialog);

  protected openSignInDialog(): void {
    const signInDialogRef: MatDialogRef<SigninDialogComponent> = this.dialog.open(SigninDialogComponent);

    signInDialogRef.afterClosed().subscribe((credentials: Credentials | null) => {
      if (credentials) {
        this.authService.creatUser(credentials.email, credentials.password);
      }
    })
  }
}
