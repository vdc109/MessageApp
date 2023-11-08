import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  press(event:KeyboardEvent) {
    var key = event.key;
    
    if (key == "Enter") {
      this.login(event);
    }
  }

  url = "http://localhost:3000/user/signin";
  router: Router;
  constructor (private http: HttpClient, router: Router) {
    this.router = router;
  }

  login(event: Event) {
    var email = (<HTMLInputElement>document.getElementById("Email")).value;
    var password = (<HTMLInputElement>document.getElementById("pass")).value;

    var form = JSON.stringify({
      email: email,
      password: password
    })

    var data = JSON.parse(form);
    var user_id = "";
    console.log(data);
    
    this.http.post(this.url, data).subscribe((response) => {
      console.log(response);
      if ((JSON.parse(JSON.stringify(response)))["status"] == "SUCCESS") {
        user_id = ((JSON.parse(JSON.stringify(response)))["data"][0]["_id"]);
        console.log(typeof(user_id));
        this.router.navigate(["chat/users/" + user_id], {queryParams: {
          id: user_id
        }});
      }
    })
  }
}
