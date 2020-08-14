import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestMethodConfig} from '../../../typings';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  configs: RequestMethodConfig;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.configs = this.route.snapshot.data.kratos;
    console.log(this.configs);
  }

  goToRegister(): void {
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    //   this.router.navigate(['/register']));
  }

}
