import SensorName from 'components/generic/SensorName';
import React from 'react';
import styles from './LatestInfo.scss';

export interface Props {
  sensor: Api.Sensor.Get;
  readings: Api.Reading.Get[];
}

function LatestInfo(props: Props) {
  if (props.readings.length > 0) {
    const roundLevel = 100;
    const value = Math.round(props.readings[props.readings.length - 1].value * roundLevel) / roundLevel;
    return (
      <p className={styles.info}>
        Latest readings for <SensorName sensor={props.sensor} />: {value}˚C
      </p>
    );
  } else {
    return (
      <p className={styles.info}>
        No Readings for <SensorName sensor={props.sensor} />
      </p>
    );
  }
}

export default LatestInfo;
