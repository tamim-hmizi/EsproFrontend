import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/demo/service/jwt.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private service: JwtService, private fb: FormBuilder) {}

  ngOnInit(): void {
    //   localStorage.clear();
    this.registerForm = this.fb.group(
      {
        nom: ['', [Validators.required, Validators.maxLength(10)]],
        prenom: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
          ],
        ],
        //confirmPassword: ['', [Validators.required]],
        role: ['USER'],
      },
      { Validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password != confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  submitForm() {
    console.log(this.registerForm?.value);

    this.service.register(this.registerForm?.value).subscribe((response) => {
      if (response.id != null) {
        alert('Inscription Valide');
      } else {
        alert('check  your password');
      }
    });
  }

  get nom() {
    return this.registerForm.controls['nom'];
  }

  get prenom() {
    return this.registerForm.controls['prenom'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get role() {
    return this.registerForm.controls['role'];
  }
}
