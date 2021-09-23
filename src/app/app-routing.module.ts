import {NgModule} from "@angular/core";
import {Routes} from "@angular/router";
import {NativeScriptRouterModule} from "@nativescript/angular";

import {RegisterComponent} from "./registration/register.component";
import {LoginComponent} from "~/app/login/login.component";
import {MarkersMapComponent} from "~/app/home/js/markersmap/markersmap.component";
import {GalleryComponent} from "~/app/gallery/js/gallery.component";

const routes: Routes = [
    {path: "", redirectTo: "/login", pathMatch: "full"},
    {path: "register", component: RegisterComponent},
    {path: "login", component: LoginComponent},
    {path: "home", component: MarkersMapComponent},
    {path: "gallery", component: GalleryComponent},
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {
}
