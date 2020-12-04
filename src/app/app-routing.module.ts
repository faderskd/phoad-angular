import {NgModule} from "@angular/core";
import {Routes} from "@angular/router";
import {NativeScriptRouterModule} from "@nativescript/angular";

import {RegisterComponent} from "./registration/register.component";
import {LoginComponent} from "~/app/login/login.component";
import {PhotosMapComponent} from "~/app/home/photosmap.component";
import {GalleryComponent} from "~/app/gallery/gallery.component";

const routes: Routes = [
    {path: "", redirectTo: "/login", pathMatch: "full"},
    {path: "register", component: RegisterComponent},
    {path: "login", component: LoginComponent},
    {path: "home", component: PhotosMapComponent},
    {path: "gallery", component: GalleryComponent},
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {
}
