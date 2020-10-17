import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import {RegisterComponent} from "./registration/register.component";
import {LoginComponent} from "~/app/login/login.component";

const routes: Routes = [
    { path: "", redirectTo: "/register", pathMatch: "full" },
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
