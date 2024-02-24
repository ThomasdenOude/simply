import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LoginDialogComponent } from '../authentication/components/login-dialog/login-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private matDialog: MatDialog = inject(MatDialog);

  protected openLoginDialog(): void {
    this.matDialog.open(LoginDialogComponent)
  }
}
