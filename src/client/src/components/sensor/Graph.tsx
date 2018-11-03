import { Chart } from 'chart.js';
import React, { Component, createRef, RefObject } from 'react';
import { fetchReadings } from 'src/data';
import styles from './Graph.scss';

export interface Props {
  sensorId: number;
}

interface State {
  readings: Api.Reading.Get[];
}

class Graph extends Component<Props, State> {
  public state: State = {
    readings: [],
  };

  private canvasRef: RefObject<HTMLCanvasElement> = createRef();
  private currentSensorId = this.props.sensorId;
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

    // update the readings
    await this.updateReadings();
  }

  public async componentDidUpdate() {
    // update readings if we have a new sensor ID
    if (this.props.sensorId !== this.currentSensorId) {
      await this.updateReadings();
    }

    // update chart display with latest state
    this.chart.data.labels = this.state.readings.map(v => {
      const time = new Date(v.takenAt);
      if (process.env.NODE_ENV === 'development') {
        return [time.toLocaleDateString(), time.toLocaleTimeString()];
      } else {
        return time.toLocaleTimeString();
      }
    });
    this.chart.data.datasets![0].data = this.state.readings.map(v => v.value);
    this.chart.update();
  }

  public render() {
    return (
      <canvas className={styles.canvas} ref={this.canvasRef} />
    );
  }

  private async updateReadings() {
    try {
      // attempt to fetch the new readings
      this.setState({
        readings: await fetchReadings(this.props.sensorId),
      });

      // if we did fetch them, make sure we don't refetch for every update
      this.currentSensorId = this.props.sensorId;
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  }
}

export default Graph;
