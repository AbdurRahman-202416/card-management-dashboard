import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HighchartsChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  // Mock Data
  dashboardData = {
    activeCards: {
      total: '4,230',
      debit: 2150,
      prepaid: 1420,
      credit: 660,
    },
    lifecycle: {
      issued: 320,
      pending: 55,
      expired: 18,
    },
    transactions: {
      total: '58,200',
      domestic: '42,000',
      international: '16,200',
      volume: '৳ 1.2M', // Tk symbol is used in the image
    },
    successRate: {
      rate: '95%',
      approved: '55,000',
      declined: '3,000',
    }
  };

  activeCardsChartOptions: Highcharts.Options = {};
  portfolioChartOptions: Highcharts.Options = {};
  successRateChartOptions: Highcharts.Options = {};
  transactionChartOptions: Highcharts.Options = {};
  mccChartOptions: Highcharts.Options = {};

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    // 1. Donut Chart for Active Cards
    this.activeCardsChartOptions = {
      chart: { type: 'pie', height: 160, backgroundColor: 'transparent', margin: [0, 0, 0, 0] },
      title: { text: '' },
      credits: { enabled: false },
      tooltip: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '75%',
          dataLabels: { enabled: false },
          borderWidth: 0,
          colors: ['#3b48f2', '#00bfff', '#ffaf00']
        }
      },
      series: [{
        type: 'pie',
        name: 'Cards',
        data: [
          ['Debit', this.dashboardData.activeCards.debit],
          ['Prepaid', this.dashboardData.activeCards.prepaid],
          ['Credit', this.dashboardData.activeCards.credit]
        ]
      }]
    };

    // 2. Stacked Horizontal Bar for Portfolio Overview
    this.portfolioChartOptions = {
      chart: { type: 'bar', height: 280, backgroundColor: 'transparent' },
      title: { text: '' },
      xAxis: {
        categories: ['506123', '506456', '506789', '507111', '508222', '509999'],
        lineWidth: 0,
        tickWidth: 0,
        labels: { style: { color: '#6e7a8a', fontSize: '11px' } }
      },
      yAxis: {
        min: 0,
        title: { text: '' },
        gridLineColor: '#f0f2f5',
        labels: { formatter: function () { return (this.value as number) / 1000 + 'K'; }, style: { color: '#6e7a8a', fontSize: '11px' } }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'top',
        itemStyle: { color: '#6e7a8a', fontWeight: 'normal', fontSize: '12px' },
        symbolRadius: 2,
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          borderWidth: 0
        },
        bar: {
          pointWidth: 20
        }
      },
      tooltip: { enabled: false },
      credits: { enabled: false },
      series: [
        { type: 'bar', name: 'Debit Card', color: '#524eee', data: [600, 400, 500, 300, 200, 150] },
        { type: 'bar', name: 'Prepaid Card', color: '#00bfff', data: [200, 300, 200, 250, 250, 220] },
        { type: 'bar', name: 'Credit Card', color: '#ffb020', data: [100, 50, 100, 150, 120, 140] }
      ]
    };

    // 3. Success Rate Donut Chart
    this.successRateChartOptions = {
      chart: { type: 'pie', height: 160, backgroundColor: 'transparent', margin: [0, 0, 0, 0] },
      title: { text: '' },
      credits: { enabled: false },
      tooltip: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '75%',
          dataLabels: { enabled: false },
          borderWidth: 0,
          colors: ['#6ed18c', '#ff6b6b']
        }
      },
      series: [{
        type: 'pie',
        name: 'Rate',
        data: [
          ['Approved', 55000],
          ['Declined', 3000]
        ]
      }]
    };

    // 4. Smooth Area Chart for Transaction Overview
    this.transactionChartOptions = {
      chart: { type: 'areaspline', height: 250, backgroundColor: 'transparent' },
      title: { text: '' },
      xAxis: {
        categories: ['Sep 27', 'Sep 28', 'Sep 29', 'Sep 30', 'Oct 1', 'Oct 2', 'Oct 3'],
        tickmarkPlacement: 'on',
        lineWidth: 0,
        labels: { style: { color: '#6e7a8a', fontSize: '11px' } },
        tickWidth: 0,
      },
      yAxis: {
        title: { text: '' },
        labels: { formatter: function () { return (this.value as number) / 1000 + 'K'; }, style: { color: '#6e7a8a', fontSize: '11px' } },
        gridLineColor: '#f0f2f5'
      },
      tooltip: { enabled: true, shared: true },
      credits: { enabled: false },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: { color: '#6e7a8a', fontWeight: 'normal', fontSize: '12px' },
        symbolRadius: 6,
      },
      plotOptions: {
        areaspline: { fillOpacity: 0.1, marker: { enabled: false }, lineWidth: 2 }
      },
      series: [
        { type: 'areaspline', name: 'Domestic', color: '#6ed18c', data: [150, 450, 600, 420, 520, 800, 600] },
        { type: 'areaspline', name: 'International', color: '#524eee', data: [500, 650, 420, 850, 680, 1900, 1750] }
      ]
    };

    // 5. MCC Top Merchant Categories (Semi-circle donut)
    this.mccChartOptions = {
      chart: { type: 'pie', height: 250, backgroundColor: 'transparent' },
      title: { text: '' },
      tooltip: { enabled: false },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '150%',
          innerSize: '60%',
          borderWidth: 1,
          borderColor: '#fff',
          dataLabels: {
            enabled: true,
            format: '{point.y}%',
            distance: -30,
            style: { fontWeight: 'bold', color: 'white', textOutline: 'none', fontSize: '12px' }
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'MCC',
        data: [
          { name: 'Cat 1', y: 28, color: '#3c38d2' },
          { name: 'Cat 2', y: 24, color: '#5450f2' },
          { name: 'Cat 3', y: 17, color: '#7e7bf5' },
          { name: 'Cat 4', y: 13, color: '#a09ef7' },
          { name: 'Cat 5', y: 10, color: '#bab9fa' },
          { name: 'Cat 6', y: 8, color: '#d0cffc' }
        ]
      }]
    };
  }
}
