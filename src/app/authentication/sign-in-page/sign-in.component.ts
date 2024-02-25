import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SigninDialogComponent } from '../components/signin-dialog/signin-dialog.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SigninDialogComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  private dialog: MatDialog = inject(MatDialog);

  protected openSignInDialog(): void {
    this.dialog.open(SigninDialogComponent)
  }
}
