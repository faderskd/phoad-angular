import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {ModalDialogService, NativeScriptFormsModule, NativeScriptModule} from "@nativescript/angular";
import {NativeScriptUISideDrawerModule} from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {RegisterComponent} from "./registration/register.component";
import {ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "~/app/login/login.component";
import {MarkersMapComponent} from "~/app/home/js/markersmap/markersmap.component";
import {TNSFontIconModule} from "nativescript-ngx-fonticon";

import {registerElement} from "@nativescript/angular";
import {GalleryComponent} from "~/app/gallery/js/gallery.component";
import {GalleryModalComponent} from "~/app/gallery/js/gallery.modal";
import {MarkerModalComponent} from "~/app/home/js/markersmodal/marker-modal.component";


registerElement("PreviousNextView", () => require("@nativescript/iqkeyboardmanager").PreviousNextView);

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule,
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
        MarkersMapComponent,
        GalleryComponent,
        GalleryModalComponent,
        MarkerModalComponent
    ],
    providers: [
        ModalDialogService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule {
}
