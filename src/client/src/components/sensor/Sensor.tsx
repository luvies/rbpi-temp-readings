import React, { Component, FormEvent } from 'react';
import { updateSensor } from 'src/data';
import Graph from './Graph';
import styles from './Sensor.scss';

export interface Props {
  sensor: Api.Sensor.Get;
  onUpdate: () => void;
}

interface State {
  desc: string;
}

class Sensor extends Component<Props, State> {
  public state: State = {
    desc: this.props.sensor.desc,
  };
  public propDesc = this.props.sensor.desc;

  public componentDidUpdate() {
    if (this.props.sensor.desc !== this.propDesc && this.state.desc === this.propDesc) {
      this.setState({
        desc: this.props.sensor.desc,
      });
    }
  }

  public render() {
    return (
      <div className={styles.container}>
        <div className={styles.info}>
          <h1 className={styles.header}>{this.props.sensor.serialNum}</h1>
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <input
              className={styles.descInput}
              type="text"
              defaultValue={this.props.sensor.desc}
              onInput={this.handleDescInput}
            />
            <button className={styles.updateButton} type="submit">Update</button>
          </form>
        </div>
        <div className={styles.canvasContainer}>
          <div className={styles.canvasInner}>
            <Graph sensorId={this.props.sensor.id} />
          </div>
        </div>
      </div>
    );
  }

  private handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // update sensor on server
      await updateSensor(this.props.sensor.id, {
        desc: this.state.desc,
      });

      // if we did it, fire the update event
      if (this.props.onUpdate) {
        this.props.onUpdate();
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  }

  private handleDescInput = (e: FormEvent<HTMLInputElement>) => {
    this.setState({
      desc: e.currentTarget.value,
    });
  }
}

export default Sensor;
