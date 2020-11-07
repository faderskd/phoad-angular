import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserCredentials} from "~/app/common/user-credentials";
import {ServerClient} from "~/app/common/http";
import {HttpResponse, Page} from "@nativescript/core";
import {alert} from "@nativescript/core/ui/dialogs";
import {RouterExtensions} from "@nativescript/angular";

@Component({
    selector: "register-form",
    templateUrl: "./register.component.html",
    styleUrls: ["../styles/common.style.scss"]
})
export class RegisterComponent {
    client: ServerClient
    registerForm: FormGroup
    emailError = ''
    passwordError = ''
    confirmPasswordError = ''
    routerExtensions: RouterExtensions

    constructor(client: ServerClient, routerExtensions: RouterExtensions, page: Page) {
        this.client = client;
        this.registerForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
            confirmPassword: new FormControl('', [Validators.required])
        });
        this.routerExtensions = routerExtensions;
        page.actionBarHidden = true;
    }

    async submit() {
        if (this.validateForm()) {
            let email = this.registerForm.get('email').value;
            let password = this.registerForm.get('password').value;
            let newUser = new UserCredentials(email, password);
            try {
                let response = await this.client.registerUser(newUser);
                await this.handleResponse(response);
            } catch (e) {
                await alert("Sorry, something gone wrong :(")
                console.warn("Error during user registration", e);
            }
        }
    }

    validateForm() {
        let emailResult = this.validateEmail();
        let passResult = this.validatePassword();
        let confirmPassResult = this.validateConfirmPassword();
        let passMatchResult = this.validatePasswordsMatch();
        return emailResult && passResult && confirmPassResult && passMatchResult;
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

    redirectToLogin() {
        this.routerExtensions.back();
    }

    private async handleResponse(response: HttpResponse) {
        if (response.statusCode === 201) {
            let options = {
                message: "Great, you successfully created your account. Now you can login !",
                okButtonText: "OK"
            };
            await alert(options);
            this.redirectToLogin();
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
