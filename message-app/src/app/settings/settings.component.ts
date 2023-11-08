import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  router: Router;
  http: HttpClient;
  @Input() name = '';
  @Input() email= '';
  constructor(private route: ActivatedRoute, router: Router, http: HttpClient ) {
    this.router = router;
    this.http = http;
  }

  user_id: any;
  
  @Output()sendRequestData = new EventEmitter();
  
  url = "http://localhost:3000/user/fetch/";
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      this.user_id = params.id;
      console.log(this.user_id);
      this.http.get(this.url+this.user_id).subscribe((res) => {
        var name = ((JSON.parse(JSON.stringify(res)))["data"][0]["userName"]);
        var email = ((JSON.parse(JSON.stringify(res)))["data"][0]["email"]);
        this.name = name;
        this.email = email;
        console.log(name, email);
      })
    })
  }
  
  direct_request(event: Event) {
    this.router.navigate(["request/users/" + this.user_id], {queryParams: {
          id: this.user_id
    }});
  }

  direct_add(event: Event) {
    this.router.navigate(["add/users/" + this.user_id], {queryParams: {
          id: this.user_id
    }});
  }

  direct_chat(event: Event) {
    this.router.navigate(["chat/users/" + this.user_id], {queryParams: {
          id: this.user_id
    }});
  }

  signout(event: Event) {
    this.router.navigate([""]);
  }

  url_delete = "http://localhost:3000/user/delete/"
  delete(event: Event) {
    console.log(this.user_id);
    this.http.post(this.url_delete + this.user_id, this.user_id).subscribe ((res) => {
      console.log(res);
      this.router.navigate([""]);
    })
  }
}