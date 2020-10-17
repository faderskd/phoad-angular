import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NewUser} from "~/app/registration/new-user";
import {ServerClient} from "~/app/common/http";
import {HttpResponse} from "@nativescript/core";

@Component({
    selector: "register-form",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.common.css"]
})
export class RegisterComponent {
    client: ServerClient
    registerForm: FormGroup;
    emailError = '';
    passwordError = '';
    confirmPasswordError = '';

    constructor(client: ServerClient) {
        this.client = client;
        this.registerForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
            confirmPassword: new FormControl('', [Validators.required])
        });
    }

    async submit() {
        if (this.validateForm()) {
            let email = this.registerForm.get('email').value;
            let password = this.registerForm.get('password').value;
            let newUser = new NewUser(email, password);
            let response = await this.client.registerUser(newUser);
            this.handleResponse(response);
        }
    }

    validateForm() {
        return this.validateEmail() &&
            this.validatePassword() &&
            this.validateConfirmPassword() &&
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

    validateEmail(): boolean {
        let emailErrors = this.registerForm.get('email').errors;

        if (emailErrors === null) {
            this.emailError = '';
        } else if (emailErrors.required === true) {
            this.emailError = 'This field is required';
        } else if (emailErrors.email === true) {
            this.emailError = 'Email address required';
        }
        return emailErrors === null;
    }

    validatePassword(): boolean {
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
        return passwordErrors === null;
    }

    validateConfirmPassword(): boolean {
        let confirmPasswordErrors = this.registerForm.get('confirmPassword').errors;

        if (confirmPasswordErrors === null) {
            this.confirmPasswordError = ''
        } else if (confirmPasswordErrors.required === true) {
            this.confirmPasswordError = 'This field is required';
        }
        return this.validatePasswordsMatch() && confirmPasswordErrors === null;
    }

    validatePasswordsMatch(): boolean {
        let confirmPassword = this.registerForm.get('confirmPassword').value;
        let password = this.registerForm.get('password').value;
        let confirmPasswordErrors = this.registerForm.get('confirmPassword').errors;
        if (confirmPasswordErrors === null && password !== confirmPassword) {
            this.confirmPasswordError = 'Passwords must be the same'
            return false;
        }
        return true;
    }

    private handleResponse(response: HttpResponse) {
        if (response.statusCode === 201) {
            let options = {
                message: "Great, you successfully created your account. Now you can login !",
                okButtonText: "OK"
            };
            alert(options)
            //.then(login);
        } else if (response.statusCode === 400) {
            this.handleErrors(response.content.toJSON());
        } else {
            throw new Error("Unexpected status code " + response.statusCode);
        }
    }

    private handleErrors(errors: object) {
        if (errors['username']) {
            this.emailError = errors['username'][0];
        } else {
            alert(errors);
        }
    }
}
