import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MainChatComponent } from './chat/chat.component';
import { SettingsComponent } from './settings/settings.component';
import { AddComponent } from './add/add.component';
import { RequestComponent } from './request/request.component'
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'chat/users/:id', component: MainChatComponent},
  { path: 'setting/users/:id', component: SettingsComponent},
  { path: 'add/users/:id', component: AddComponent},
  { path: 'request/users/:id', component: RequestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
