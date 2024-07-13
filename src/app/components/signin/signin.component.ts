import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GoogleSsoDirective } from '../../directives/google-sso.directive';

@Component({
  selector: 'z-signin',
  standalone: true,
  imports: [MatButtonModule, GoogleSsoDirective],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent {

}
