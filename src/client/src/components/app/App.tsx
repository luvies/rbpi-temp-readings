import Sensor from 'components/sensor/Sensor';
import React, { Component } from 'react';
import { fetchReadings, fetchSensors, updateSensor } from 'src/data';
import styles from './App.scss';
import LatestInfo from './LatestInfo';

interface SensorInfo {
  info: Api.Sensor.Get;
  readings: Api.Reading.Get[];
}

interface State {
  sensors: SensorInfo[];
  error?: {
    text: string,
    message: string,
  };
}

class App extends Component<{}, State> {
  public state: State = {
    sensors: [],
  };

  public async componentDidMount() {
    await this.updateSensors();
  }

  public render() {
    return (
      <div className={styles.container}>
        {this.state.error ?
          <p className={styles.error}>{this.state.error.text}: {this.state.error.message}</p>
          :
          <>
            <div className={styles.latest}>
              <table className={styles.latestTable}>
                <thead>
                  <tr>
                    <th colSpan={3}>Latest Readings</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.sensors.map(sensor => {
                    return <LatestInfo key={sensor.info.id} sensor={sensor.info} readings={sensor.readings} />;
                  })}
                </tbody>
              </table>
            </div>
            <ul className={styles.list}>
              {this.state.sensors.map(sensor => {
                return (
                  <li key={sensor.info.id} className={styles.listItem}>
                    <Sensor
                      sensor={sensor.info}
                      readings={sensor.readings}
                      onUpdateDesc={this.handleSensorUpdate}
                    />
                  </li>
                );
              })}
            </ul>
          </>
        }
      </div>
    );
  }

  private async updateSensors() {
    try {
      // state update object
      const update: {
        sensors: SensorInfo[],
      } = {
        sensors: [],
      };

      // fetch sensor data
      const sensors = await fetchSensors();
      for (const sensor of sensors) {
        update.sensors.push({
          info: sensor,
          readings: await fetchReadings(sensor.id),
        });
      }

      // apply state
      this.setState(update);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      this.setState({
        error: {
          text: 'Error fetching sensor data',
          message: err.message,
        },
      });
    }
  }

  private handleSensorUpdate = async (id: number, desc: string) => {
    try {
      // update sensor on server
      await updateSensor(id, {
        desc,
      });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      this.setState({
        error: {
          text: 'Error updating sensor info',
          message: err.message,
        },
      });
    }
    await this.updateSensors();
  }
}

export default App;
