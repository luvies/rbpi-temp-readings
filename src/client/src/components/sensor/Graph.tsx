import { Chart } from 'chart.js';
import React, { Component, createRef, RefObject } from 'react';
import styles from './Graph.scss';

export interface Props {
  readings: Api.Reading.Get[];
}

class Graph extends Component<Props> {
  private canvasRef: RefObject<HTMLCanvasElement> = createRef();
  private chart!: Chart;

  public async componentDidMount() {
    // init chart.js instance
    this.chart = new Chart(
      this.canvasRef.current!,
      {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              lineTension: 0,
              borderColor: '#545454d1',
              borderWidth: 0.3,
              pointRadius: 0,
              label: 'Readings Over The Past 24 Hours',
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      },
    );

    this.applyReadings();
  }

  public componentDidUpdate() {
    this.applyReadings();
  }

  public render() {
    return (
      <canvas className={styles.canvas} ref={this.canvasRef} />
    );
  }

  private applyReadings() {
    // update chart display with latest state
    this.chart.data.labels = this.props.readings.map(v => {
      const time = new Date(v.takenAt);
      if (process.env.NODE_ENV === 'development') {
        return [time.toLocaleDateString(), time.toLocaleTimeString()];
      } else {
        return time.toLocaleTimeString();
      }
    });
    this.chart.data.datasets![0].data = this.props.readings.map(v => v.value);
    this.chart.update();
  }
}

export default Graph;
