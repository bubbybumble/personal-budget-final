import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public data: { data: any[]; labels: any[]; }
  public editing = -1;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.onDataRefreshed();
    this.dataService.onDataUpdated.subscribe(updatedData => this.onDataRefreshed());
  }
  onDataRefreshed() {
    this.data = this.dataService.getData();
    this.editing = -1;
  }

  editItem(i: number){
    this.editing = i;
    this.dataService.dataToEdit = i;
  }

  deleteItem(name: string) {
    this.dataService.deleteEntry(name);
  }
}
