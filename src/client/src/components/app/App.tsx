import Sensor from 'components/sensor/Sensor';
import React, { Component } from 'react';
import { fetchSensors } from 'src/data';
import styles from './App.scss';

interface State {
  sensors: Api.Sensor.Get[];
  error?: string;
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
          <p className={styles.error}>Error fetching sensors: {this.state.error}</p>
          :
          <ul className={styles.list}>
            {this.state.sensors.map(sensor => {
              return (
                <li key={sensor.id} className={styles.listItem}>
                  <Sensor sensor={sensor} onUpdate={this.handleSensorUpdate} />
                </li>
              );
            })}
          </ul>
        }
      </div>
    );
  }

  private async updateSensors() {
    try {
      this.setState({
        sensors: await fetchSensors(),
      });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      this.setState({
        error: err.message,
      });
    }
  }

  private handleSensorUpdate = async () => {
    await this.updateSensors();
  }
}

export default App;
