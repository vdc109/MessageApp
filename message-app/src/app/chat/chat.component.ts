import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { LoginComponent } from '../login/login.component';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
// import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-mainchat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class MainChatComponent {
  router: Router;
  http: HttpClient;
  array_id: Array<string>;
  user: string;
  currentId: string;
  currentNum: number;
  @Input() array: Array<string>;
  @Input() temp: Array<string>;
  arrayDB: Array<Array<string>>;
  arrayDB1: Array<Array<string>>;
  show: Array<string>;
  @Input() showm: Array<string>;
  @Input() show1: Array<string>;
  show2: Array<string>;
  // websocket: WebsocketService;
  constructor(private route: ActivatedRoute, router: Router, http: HttpClient) {
    this.router = router;
    this.http = http;
    this.array = [];
    this.arrayDB = [];
    this.arrayDB1 = [];
    this.temp = [];
    this.array_id = [];
    this.showm = [];
    this.show1 = [];
    this.show = [];
    this.show2 = [];
    this.user = '';
    this.currentId ='';
    this.currentNum=0;
  }

  url_fetch = "http://localhost:3000/user/fetch/"
  check: any
  fetching(x : any) {
    this.arrayDB1 = []
    this.show = []
    this.show2 = []
    this.http.get(this.url_fetch + this.user_id).subscribe((res) => {
      var chatDB = ((JSON.parse(JSON.stringify(res))))["data"][0]["chatDB"];
      this.temp = [];
      var count = -1;
      for (var i of chatDB) {
        count ++;
        if (i["from"] == x || i["to"] == x) {
          this.temp.push(i);
          if (i["from"] == x) {
            this.show.push(this.array[this.currentNum]);
            this.show2.push((JSON.parse(JSON.stringify(this.temp)))[count]["value"]);
          } else{
            this.show.push(this.user);
            this.show2.push((JSON.parse(JSON.stringify(this.temp)))[count]["value"]);
          }
        }
      }
        
      this.show1 = this.show;
      this.showm = this.show2;
    })

    // console.log("fetching", this.arrayDB);
  }

  user_id: any;
  
  ngOnInit(): void {
    // this.websocket.connect();

    this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      this.user_id = params.id;
      console.log(this.user_id);
      
      this.http.get(this.url_fetch + this.user_id).subscribe((res) => {
        var user = ((JSON.parse(JSON.stringify(res)))["data"][0]["userName"]);
        this.user = user;
        var friends = ((JSON.parse(JSON.stringify(res)))["data"][0]["friends"]);
        var chatDB = ((JSON.parse(JSON.stringify(res))))["data"][0]["chatDB"];
        console.log(chatDB);
        for (var x of friends) {
          // this.array.push()
          console.log(x);
          this.temp = [];
          this.array_id.push((JSON.parse(JSON.stringify(x)))["_id"]);
          for (var i of chatDB) {
            if (i["from"] == (JSON.parse(JSON.stringify(x)))["_id"] || i["to"] == (JSON.parse(JSON.stringify(x)))["_id"]) {
              this.temp.push(i);
            }
          }
  
          this.http.get(this.url_fetch + (JSON.parse(JSON.stringify(x)))["_id"]).subscribe((res1) => {
            console.log((JSON.parse(JSON.stringify(res1)))["data"][0]["userName"]);
            this.array.push((JSON.parse(JSON.stringify(res1)))["data"][0]["userName"]);
          })
  
          this.arrayDB.push(this.temp);
        }
      })
    })
  }

  ngOnDestroy() {
    if (this.check) {
      clearInterval(this.check);
    }

    // this.websocket.disconnect();
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

  direct_setting(event: Event) {
    this.router.navigate(["setting/users/" + this.user_id], {queryParams: {
          id: this.user_id
    }});
  }

  @Input() button = '';
  chat(event: Event) {
    this.show1 = [];
    this.showm = [];
    var target = event.target;
    var idnode = (<HTMLButtonElement>(target)).attributes.getNamedItem('id')?.nodeValue || (<HTMLImageElement>(target)).attributes.getNamedItem('id')?.nodeValue;
    var user_id = JSON.parse(JSON.stringify(idnode));
    // this.router.navigate(["chat/users/"+this.user_id], {queryParams: {
    //   id: this.user_id,
    //   id2: user_id
    // }})
    var id = user_id[user_id.length-1];
    this.currentId = this.array_id[parseInt(id)];
    this.button = this.array[parseInt(id)];
    this.currentNum = parseInt(id);
    this.check = setInterval(() => {
      this.fetching(this.array_id[parseInt(id)])
    }, 1000);

    (<HTMLButtonElement>document.getElementById('chat'+id)).style.backgroundColor = "#EAEBEC";
    for (let i = 0; i < this.array.length; i++) {
      if (i != parseInt(id)) {
        (<HTMLButtonElement>document.getElementById('chat'+i.toString())).style.backgroundColor = "white";
      }
    }

    console.log(this.show1);
    console.log(this.showm);
  }

  press(event: KeyboardEvent) {
    var key = event.key;
    
    if (key == "Enter") {
      this.send(event);
    }
  }

  send(event: Event) {
    var text = (<HTMLInputElement>document.getElementById("text")).value;
    (<HTMLInputElement>document.getElementById("text")).value = '';

    var form = JSON.stringify({
      "from": this.user_id,
      "to": this.currentId,
      "value": text,
      "time": Date()
    })

    var data = JSON.parse(form);

    this.http.post("http://localhost:3000/user/chat/"+this.user_id+"/"+this.currentId, data).subscribe((res) => {
      console.log(res);
    })
  }
}