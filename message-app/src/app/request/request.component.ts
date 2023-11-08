import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Optional } from '@angular/core';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent {
  router: Router;
  http: HttpClient;
  @Input() array: Array<string>;
  array_id: Array<string>;
  constructor(private route: ActivatedRoute, router: Router, http: HttpClient) {
    this.router = router;
    this.http = http;
    this.array = [];
    this.array_id = [];
  }

  url_fetch = "http://localhost:3000/user/fetch/"
  user_id: any;
  
  // this.array = this.array || [];
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      this.user_id = params.id;
      console.log(this.user_id);
      
      console.log(this.array);
      this.http.get(this.url_fetch + this.user_id).subscribe((res) => {
        var requests = ((JSON.parse(JSON.stringify(res)))["data"][0]["receive"]);
        console.log(requests);
        for (var x of requests) {
          this.array_id.push((JSON.parse(JSON.stringify(x)))["_id"]);
          this.http.get(this.url_fetch + (JSON.parse(JSON.stringify(x)))["_id"]).subscribe((res1) => {
            console.log((JSON.parse(JSON.stringify(res1)))["data"][0]["userName"]);
            this.array.push((JSON.parse(JSON.stringify(res1)))["data"][0]["userName"]);
          })
        }
        console.log(this.array_id);
      })
    })
  }
  
  direct_chat(event: Event) {
    this.router.navigate(["chat/users/" + this.user_id], {queryParams: {
          id: this.user_id
    }});
  }

  direct_add(event: Event) {
    this.router.navigate(["add/users/" + this.user_id], {queryParams: {
          id: this.user_id
    }});
  }

  direct_setting(event: Event) {
    this.router.navigate(["setting/users/" + this.user_id], {queryParams: {
          id: this.user_id
    }});
  }

  @Input() button = [''];
  accept(event: Event) {
    var target = event.target;
    var idnode = (<HTMLButtonElement>(target)).attributes.getNamedItem('id')?.nodeValue || (<HTMLImageElement>(target)).attributes.getNamedItem('id')?.nodeValue;
    var user_id = JSON.parse(JSON.stringify(idnode));
    var id = user_id[user_id.length-1];
    console.log(user_id);
    (<HTMLButtonElement>document.getElementById('accept'+id)).style.display = 'none';
    (<HTMLButtonElement>document.getElementById('decline'+id)).style.display = 'none';
    console.log(parseInt(id));
    this.button[parseInt(id)] = 'Accepted';
    
    this.http.post("http://localhost:3000/user/accept/"+this.user_id+"/"+this.array_id[parseInt(id)], user_id).subscribe((res) => {
      console.log(res);
    })
  }

  decline(event: Event) {
    var target = event.target;
    var idnode = (<HTMLButtonElement>(target)).attributes.getNamedItem('id')?.nodeValue || (<HTMLImageElement>(target)).attributes.getNamedItem('id')?.nodeValue;
    var user_id = JSON.parse(JSON.stringify(idnode));
    var id = user_id[user_id.length-1];
    console.log(user_id);
    (<HTMLButtonElement>document.getElementById('accept'+id)).style.display = 'none';
    (<HTMLButtonElement>document.getElementById('decline'+id)).style.display = 'none';
    console.log(parseInt(id));
    this.button[parseInt(id)] = 'Declined';

    this.http.post("http://localhost:3000/user/decline/"+this.user_id+"/"+this.array_id[parseInt(id)], user_id).subscribe((res) => {
      console.log(res);
    })
  }
}
