import { Component, ElementRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  router: Router;
  http: HttpClient
  constructor(private route: ActivatedRoute, router: Router, http: HttpClient) {
    this.router = router;
    this.http = http;
  }

  user_id: any;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      this.user_id = params.id;
      console.log(this.user_id);
    })
  }
  
  direct_request(event: Event) {
    this.router.navigate(["request/users/" + this.user_id], {queryParams: {
          id: this.user_id
    }});
  }

  direct_chat(event: Event) {
    this.router.navigate(["chat/users/" + this.user_id], {queryParams: {
          id: this.user_id
    }});
  }

  direct_setting(event: Event) {
    this.router.navigate(["setting/users/" + this.user_id], {queryParams: {
          id: this.user_id
    }});
  }

  press(event:KeyboardEvent) {
    var key = event.key;
    
    if (key == "Enter") {
      this.search(event);
    }
  }

  @Input() name = '';
  @Input() button = '';
  current_id : any;
  url = "http://localhost:3000/user/search/";
  search (event: Event) {
    var searchData = (<HTMLInputElement>document.getElementById("search")).value;
    console.log(searchData);
    this.button = '';
    this.http.get(this.url+searchData).subscribe((res) => {
      if ((JSON.parse(JSON.stringify(res)))["status"] == "FAILED") {
        this.name = (JSON.parse(JSON.stringify(res)))["message"];
      } else {
        var name = ((JSON.parse(JSON.stringify(res)))["data"][0]["userName"]);
        var id = ((JSON.parse(JSON.stringify(res)))["data"][0]["_id"]);
        this.current_id = id;
        this.name = name;
        this.button = "Send Request";
      }
      // console.log(res);
    })
  }

  url_send = "http://localhost:3000/user/send/";
  send(event: Event) {
    console.log("sent");
    (<HTMLButtonElement>document.getElementById('sendbutton')).style.backgroundColor = 'green';
    (<HTMLButtonElement>document.getElementById('sendbutton')).textContent = 'Sent';

    this.http.post(this.url_send + this.user_id + "/" + this.current_id, {sender: this.user_id, receiver: this.current_id}).subscribe((res) => {
      console.log(res);
    })
  }
}
