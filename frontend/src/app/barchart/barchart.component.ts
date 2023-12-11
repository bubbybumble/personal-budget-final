import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas: ElementRef;
  private chartInfo: { data: any[]; labels: any[] };
  public noData = false;
  private chart: Chart<"bar", number[], string>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.onDataUpdated.subscribe(updatedData => this.onDataRefreshed());
    this.onDataRefreshed();
  }

  ngAfterViewInit(): void {
    if (!this.noData) {
      this.createChart();
    }
  }

  onDataRefreshed() {
    this.noData = false;
    this.chartInfo = this.dataService.getData();
    if (this.chartInfo === undefined) {
      this.noData = true;
      this.chartInfo = {
        data: [],
        labels: []
      }
    }
    this.updateChart();
  }

  createChart() {
    Chart.register(...registerables);
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.chartInfo.labels,
        datasets: [{
          label: 'Monthly Spending',
          data: this.chartInfo.data,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          borderWidth: 1,
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
      }
    });
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.labels = this.chartInfo.labels;
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data = this.chartInfo.data;
      });
      this.chart.update();
    }
  }
}
