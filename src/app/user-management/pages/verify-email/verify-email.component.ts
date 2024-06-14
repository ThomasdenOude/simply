import { Component } from '@angular/core';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FocusInputDirective } from '../../../base/directives/focus-input.directive';

@Component({
  selector: 'simply-verify-email',
  standalone: true,
  imports: [
    CenterPageComponent,
    MatFormField,
    MatLabel,
    MatInput,
    FocusInputDirective,
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {

}
