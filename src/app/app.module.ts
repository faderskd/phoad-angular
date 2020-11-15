import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {NativeScriptFormsModule, NativeScriptModule} from "@nativescript/angular";
import {NativeScriptUISideDrawerModule} from "nativescript-ui-sidedrawer/angular";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {RegisterComponent} from "./registration/register.component";
import {ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "~/app/login/login.component";
import {PhotosMapComponent} from "~/app/home/photosmap.component";
import {TNSFontIconModule} from "nativescript-ngx-fonticon";

import {registerElement} from "@nativescript/angular";


registerElement("PreviousNextView", () => require("@nativescript/iqkeyboardmanager").PreviousNextView);

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptUISideDrawerModule,
        ReactiveFormsModule,
        AppRoutingModule,
        TNSFontIconModule.forRoot({
            'fa': require('./styles/font-awesome.min.css').default
        })
    ],
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        PhotosMapComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule {
}
