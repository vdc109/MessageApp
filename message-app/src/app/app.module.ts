import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms'
import { SettingsComponent } from './settings/settings.component';
import { AddComponent } from './add/add.component';
import { RequestComponent } from './request/request.component';
import { MainChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    SettingsComponent,
    AddComponent,
    RequestComponent,
    MainChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideRouter([])
  ],
  bootstrap: [AppComponent, SignupComponent, MainChatComponent, SettingsComponent]
})
export class AppModule { }
