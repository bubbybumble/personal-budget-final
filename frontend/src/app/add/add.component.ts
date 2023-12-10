import { Component, EventEmitter, Output } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
  @Output() dataRefreshed = new EventEmitter<void>();
  constructor(private dataService: DataService) {}
  formData = {
    label: '',
    value: 0
  };

  add() {
    this.dataService.addEntry(this.formData.label, this.formData.value);
    this.dataRefreshed.emit();
  }
}
