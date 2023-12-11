import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
  constructor(private dataService: DataService) {}
  formData = {
    label: '',
    value: 0
  };

  add() {
    if (this.formData.value > 0){
      this.dataService.addEntry(this.formData.label, this.formData.value);
    }
    
  }
}
