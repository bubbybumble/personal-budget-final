import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.scss'
})
export class PiechartComponent {
  @ViewChild('chartCanvas') chartCanvas: ElementRef;
  private chartInfo: { data: any[]; labels: any[] };
  constructor(private dataService: DataService) {}
  data = [0];
  labels = [''];

  public noData = false;

  ngOnInit(): void {
    this.noData = false;
    this.chartInfo = this.dataService.getData();
    if (this.chartInfo === undefined) {
      this.noData = true;
      this.chartInfo = {
        data: [],
        labels: []
      }
    }
    this.data = this.chartInfo.data;
    this.labels = this.chartInfo.labels;

    if (this.data.length === 0) {
      this.noData = true;
    }
  }
  ngAfterViewInit(): void {
    if(this.noData == false) {
      this.createChart();
    }
    
  }



  createChart() {
    Chart.register(...registerables);
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Monthly Spending',
          data: this.data,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        maintainAspectRatio: false, // Set to false to control the aspect ratio
        responsive: true,
      }
    });
  }
}
