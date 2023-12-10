import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import * as pako from 'pako';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private router: Router, private token: TokenService) {}
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

  editEntry(label: string, value: number): void {
    const index = this.data.labels.indexOf(label);
    if (index >= 0) {
      this.data.data[index] = value;

      this.overwriteData();
    }

  }

  deleteEntry(label: string): void {
    const index = this.data.labels.indexOf(label);
    if (index >= 0) {
      this.data.data.splice(index, 1);
      this.data.labels.splice(index, 1);

      this.overwriteData();
    }

  }

  createData(): void {
    this.t = this.token.getToken() || "none";
    if (this.t === "none") {
      throw new Error("Auth error! Status: token not found");
    }
    this.data = {data: [], labels: []};
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

      const z: string = json.budgetData.zippedData;
  
      const gzippedDataUint8Array = new Uint8Array(Array.from(z, char => char.charCodeAt(0)));

      
      try {
        const ungzippedDataUint8Array = pako.ungzip(gzippedDataUint8Array);
        const ungzippedDataString = new TextDecoder().decode(ungzippedDataUint8Array);
        this.data = JSON.parse(ungzippedDataString) || {data: [], labels: []};  
      } catch (error) {
        console.error('Error during ungzip:', error);
      }
     
      this.router.navigate(['/']);
    });
    //.catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   window.alert(errorMessage);
    
    // });
  }

  overwriteData() {
    
    const jsonData = JSON.stringify(this.data);

    // Compress the string using gzip
    const compressedDataUint8Array = pako.gzip(jsonData);
    
    let binary = '';
    compressedDataUint8Array.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    
    

    const storedData = JSON.stringify({zippedData: binary});


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
