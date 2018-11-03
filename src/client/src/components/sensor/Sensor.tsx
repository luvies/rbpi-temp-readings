import SensorName from 'components/generic/SensorName';
import React, { Component, FormEvent } from 'react';
import Graph from './Graph';
import styles from './Sensor.scss';

export interface Props {
  sensor: Api.Sensor.Get;
  readings: Api.Reading.Get[];
  onUpdateDesc: (id: number, desc: string) => void;
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
    if (this.props.sensor.desc !== this.propDesc) {
      this.setState({
        desc: this.props.sensor.desc,
      });
      this.propDesc = this.props.sensor.desc;
    }
  }

  public render() {
    return (
      <div className={styles.container}>
        <div className={styles.info}>
          <h1 className={styles.header}>
            <SensorName sensor={this.props.sensor} />
          </h1>
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
            <Graph readings={this.props.readings} />
          </div>
        </div>
      </div>
    );
  }

  private handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // fire the update handler
    if (this.props.onUpdateDesc) {
      this.props.onUpdateDesc(this.props.sensor.id, this.state.desc);
    }
  }

  private handleDescInput = (e: FormEvent<HTMLInputElement>) => {
    this.setState({
      desc: e.currentTarget.value,
    });
  }
}

export default Sensor;
