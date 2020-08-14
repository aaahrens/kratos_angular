import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestMethodConfig} from '../../../typings';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  configs: RequestMethodConfig;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.configs = this.route.snapshot.data.kratos;
    if (this.configs == null) {
      console.log('configs are null');
    } else {
      console.dir(this.configs);
    }
  }

  async goToLogin(): Promise<void> {
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    //   this.router.navigate(['/login']));
  }
}
