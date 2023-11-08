import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;
  
  constructor(socket: WebSocket) {
    this.socket = socket;
  }

  connect(): void {
    this.socket = new WebSocket('http://localhost:3000'); // Replace with your server URL
    
    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened:', event);
    };

    this.socket.onmessage = (event) => {
      console.log('Message received from server:', event.data);
      // Handle the message from the server here
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
