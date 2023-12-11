import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  constructor(private dataService: DataService) {}

  formData = {
    value: 0
  };
  public i: number;

  edit() {
    if (this.formData.value > 0){
      this.dataService.editEntry(this.formData.value);

    }

   
  }

}
