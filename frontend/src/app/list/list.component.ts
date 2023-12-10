import { Component, Output, EventEmitter } from '@angular/core';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Output() dataRefreshed = new EventEmitter<void>();
  public data: { data: any[]; labels: any[]; }
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.onDataRefreshed();
  }
  onDataRefreshed() {
    this.data = this.dataService.getData();
  }

  deleteItem(name: string) {
    this.dataService.deleteEntry(name);
    this.dataRefreshed.emit();
  }
}
