import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ServerClient} from "~/app/common/http";
import {HttpResponse, Page} from "@nativescript/core";
import {UserCredentials} from "../common/usercredentials";
import {RouterExtensions} from "@nativescript/angular";
import {Authentication} from "~/app/common/authentication";
import {alert} from "@nativescript/core/ui/dialogs";

@Component({
    selector: "login-form",
    templateUrl: "./login.component.html",
    styleUrls: ["../styles/common.style.scss"]
})
export class LoginComponent implements OnInit {
    client: ServerClient
    loginForm: FormGroup
    emailError = ''
    passwordError = ''
    routerExtensions: RouterExtensions
    auth: Authentication

    constructor(client: ServerClient, routerExtensions: RouterExtensions, auth: Authentication, page: Page) {
        this.client = client;
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        });
        this.routerExtensions = routerExtensions;
        this.auth = auth;
        page.actionBarHidden = true;
    }

    async ngOnInit() {
        if (this.auth.isAuthenticated()) {
            await this.routerExtensions.navigateByUrl('/home');
        }
    }

    async submit() {
        if (this.validateForm()) {
            let email = this.loginForm.get('email').value;
            let password = this.loginForm.get('password').value;
            let credentials = new UserCredentials(email, password);
            try {
                let response = await this.client.loginUser(credentials);
                await this.handleResponse(response);
            } catch (e) {
                await alert("Sorry, something gone wrong :(")
                console.warn("Error during user authentication", e);
            }
        }
    }

    validateForm() {
        let emailResult = this.validateEmail();
        let passResult = this.validatePassword();
        return emailResult && passResult;
    }

    onEmailChange($event) {
        this.loginForm.get('email').setValue($event.value);
        this.validateEmail();
    }

    onPasswordChange($event) {
        this.loginForm.get('password').setValue($event.value);
        this.validatePassword();
    }

    async redirectToRegistration() {
        await this.routerExtensions.navigateByUrl("/register");
    }

    private validateEmail(): boolean {
        let emailErrors = this.loginForm.get('email').errors;

        if (emailErrors === null) {
            this.emailError = '';
        } else if (emailErrors.required === true) {
            this.emailError = 'This field is required';
        } else if (emailErrors.email === true) {
            this.emailError = 'Email address required';
        }
        return emailErrors === null;
    }

    private validatePassword(): boolean {
        let passwordErrors = this.loginForm.get('password').errors;

        if (passwordErrors === null) {
            this.passwordError = '';
        } else if (passwordErrors.required === true) {
            this.passwordError = 'This field is required';
        }
        return passwordErrors === null;
    }

    private async handleResponse(response: HttpResponse) {
        if (response.statusCode === 200) {
            this.auth.authenticate(response.content.toJSON()['token'])
            await this.routerExtensions.navigateByUrl('/home');
        } else if (response.statusCode === 400) {
            LoginComponent.handleErrors(response.content.toJSON());
        } else {
            throw new Error("Unexpected status code " + response.statusCode);
        }
    }

    private static handleErrors(errors: object) {
        if (errors['non_field_errors']) {
            alert(errors['non_field_errors'])
        } else {
            alert(errors);
        }
    }
}
