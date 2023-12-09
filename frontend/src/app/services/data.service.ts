import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import * as pako from 'pako';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private token: TokenService) {}
  private t: string;
  public elementExists: boolean;
  private data: { data: any[]; labels: any[] };

  addEntry(label: string, value: number): void {
    if (this.data.labels.includes(label)) {
      this.elementExists = true;
      return;
    }
  
    this.data.labels.push(label);
    this.data.data.push(value);

    this.overwriteData();
  }


  createData(): void {
    this.t = this.token.getToken() || "none";
    if (this.t === "none") {
      throw new Error("Auth error! Status: token not found");
    }
    this.data = {data: [], labels: []}
    this.overwriteData();
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
      this.data = JSON.parse(pako.ungzip(json.budgetData.zippedData, {to: "string"}));  // Return the actual data
     
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert(errorMessage);
    
    });
  }

  overwriteData() {
    const jsonData = JSON.stringify(this.data);

    // Compress the string using gzip
    const compressedDataUint8Array = pako.gzip(jsonData);
    
    let binary = '';
    compressedDataUint8Array.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const compressedDataString = btoa(binary);

    const storedData = JSON.stringify({zippedData: compressedDataString});

    fetch('http://127.0.0.1:5000/edit_data', {
      method: 'POST',
      headers: {
        'auth': this.t,
        'Content-Type': 'application/json'
      },
      body: storedData,
      
    });
  }
}
