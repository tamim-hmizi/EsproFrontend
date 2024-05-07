import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/demo/service/jwt.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginform!: FormGroup;

  constructor(
    private service: JwtService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    localStorage.clear();
    this.loginform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  submitForm() {
    console.log(this.loginform?.value);
    this.service.login(this.loginform.value).subscribe((response) => {
      console.log(response);
      if (response.jwt != null) {
        const jwtToken = response.jwt;
        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(jwtToken);
        console.log(decodedToken['role']);
        localStorage.setItem('jwt', jwtToken);
        if (decodedToken['role'] === 'ADMIN') {
          this.router.navigateByUrl('/skill');
        } else this.router.navigateByUrl('/dashboard');
      }
    });
  }
}
