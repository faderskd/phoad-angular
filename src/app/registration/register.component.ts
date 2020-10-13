import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "register-form",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.common.css"]
})
export class RegisterComponent {
    registerForm: FormGroup;
    emailError = '';
    passwordError = '';
    confirmPasswordError = '';

    constructor() {
        this.registerForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
            confirmPassword: new FormControl('', [Validators.required])
        });
    }

    submit(): void {
        this.validateEmail()
        this.validatePassword();
        this.validateConfirmPassword();
        this.validatePasswordsMatch();
    }

    onEmailChange($event) {
        this.registerForm.get('email').setValue($event.value);
        this.validateEmail();
    }

    onPasswordChange($event) {
        this.registerForm.get('password').setValue($event.value);
        this.validatePassword();
        this.validatePasswordsMatch();
    }

    onConfirmPasswordChange($event) {
        this.registerForm.get('confirmPassword').setValue($event.value);
        this.validateConfirmPassword();
        this.validatePasswordsMatch();
    }

    validateEmail(): void {
        let emailErrors = this.registerForm.get('email').errors;

        if (emailErrors === null) {
            this.emailError = '';
        } else if (emailErrors.required === true) {
            this.emailError = 'This field is required';
        } else if (emailErrors.email === true) {
            this.emailError = 'Email address required';
        }
    }

    validatePassword(): void {
        let passwordErrors = this.registerForm.get('password').errors;

        if (passwordErrors === null) {
            this.passwordError = '';
        } else if (passwordErrors.required === true) {
            this.passwordError = 'This field is required';
        } else if (passwordErrors.minlength) {
            let requiredLength = passwordErrors.minlength.requiredLength;
            this.passwordError = 'This field requires at least ' + requiredLength + ' characters';
        } else if (passwordErrors.maxlength) {
            let requiredLength = passwordErrors.maxlength.requiredLength;
            this.passwordError = 'This field requires at most ' + requiredLength + ' characters';
        }
    }

    validateConfirmPassword(): void {
        let confirmPasswordErrors = this.registerForm.get('confirmPassword').errors;

        if (confirmPasswordErrors === null) {
            this.confirmPasswordError = ''
        } else if (confirmPasswordErrors.required === true) {
            this.confirmPasswordError = 'This field is required';
        }
        this.validatePasswordsMatch();
    }

    validatePasswordsMatch(): void {
        let confirmPassword = this.registerForm.get('confirmPassword').value;
        let password = this.registerForm.get('password').value;
        let confirmPasswordErrors = this.registerForm.get('confirmPassword').errors;
        if (confirmPasswordErrors === null && password !== confirmPassword) {
            this.confirmPasswordError = 'Passwords must be the same'
        }
    }
}
