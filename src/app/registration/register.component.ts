import {Component} from "@angular/core";
import {NewUser} from "~/app/registration/new-user";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: "register-form",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.common.css"]
})
export class RegisterComponent {
    registerForm: FormGroup;

    constructor() {
        this.registerForm = new FormGroup({
            email: new FormControl(''),
            password: new FormControl(''),
            passwordConfirm: new FormControl('')
        });
    }

}
