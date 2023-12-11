import { Injectable, EventEmitter } from '@angular/core';
import { TokenService } from './token.service';
import * as pako from 'pako';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  onDataUpdated = new EventEmitter<{ data: any[]; labels: any[] }>();
  constructor(private router: Router, private token: TokenService) {}
  private t: string;
  public elementExists: boolean;
  public dataToEdit = -1;
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


  editEntry(value: number): void {
    if (this.dataToEdit >= 0 && this.dataToEdit < this.data.data.length) {
      this.data.data[this.dataToEdit] = value;
      
    }
    this.overwriteData();
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
    if (this.data === null || this.data === undefined){
      const d = localStorage.getItem('data') || '{"data": [], "labels": []}'
      this.data = JSON.parse(d);
    }
    
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
        localStorage.setItem('data', JSON.stringify(this.data));
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
    this.onDataUpdated.emit(this.data);
    const jsonData = JSON.stringify(this.data);
    localStorage.setItem('data', jsonData);

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
