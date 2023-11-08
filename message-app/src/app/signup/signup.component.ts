import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  press(event:KeyboardEvent) {
    var key = event.key;
    
    if (key == "Enter") {
      this.create(event);
    }
  }

  url = 'http://localhost:3000/user/signup';

  router: Router;
  constructor (private http: HttpClient, router: Router) {
    this.router = router;
  }

  create(event: Event) {
    var password = (<HTMLInputElement>document.getElementById("password")).value;
    var confirm = (<HTMLInputElement>document.getElementById("confirmpass")).value;
    if (password == "" || confirm == "") {
      alert("Some required fields are empty!");
    }
    else if (password != confirm) {
      alert("Password confirmation do not match");
    }
    else {
      var userName = (<HTMLInputElement>document.getElementById("Username")).value;
      var email = (<HTMLInputElement>document.getElementById("Email")).value;
      
      var form = JSON.stringify({
        userName: userName,
        email: email,
        password: password
      })
      
      var data = JSON.parse(form);
      
      console.log(typeof(data));
      this.http.post(this.url,data).subscribe((response) => {
        console.log(response);
        this.router.navigate([""]);
      })
    }
  }
}
