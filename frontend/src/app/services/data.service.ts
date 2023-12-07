import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private token: TokenService) {}
  private t: string;
  private data: { data: any[]; labels: any[] };

  createData(): void {
    this.t = this.token.getToken() || "none";
    if (this.t === "none") {
      throw new Error("Auth error! Status: token not found");
    }
    fetch('http://127.0.0.1:5000/create_data', {
      method: 'POST',
      headers: {
        'auth': this.t,
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      this.data = { data: [], labels: [] }; // probably saves a few milliseconds haha
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert(errorMessage);
    
    });
  }

  getData(): { data: any[]; labels: any[] } { // only have to fetch the data once
    return this.data
  }

  fetchData() {
    this.t = this.token.getToken() || "none";

    return fetch('http://127.0.0.1:5000/data', {
      method: 'GET',
      headers: {
        'auth': this.t,
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      if (!response.ok) {
        return;
      }
      return response.json();
    }).then((json) => {
      this.data = json.budgetData;  // Return the actual data
     
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert(errorMessage);
    
    });
  }
}
