import React from 'react';
import styles from './LatestInfo.scss';

export interface Props {
  sensor: Api.Sensor.Get;
  readings: Api.Reading.Get[];
}

function LatestInfo(props: Props) {
  const name = `${props.sensor.desc} (${props.sensor.serialNum})`;

  if (props.readings.length > 0) {
    const roundLevel = 100;
    const value = Math.round(props.readings[props.readings.length - 1].value * roundLevel) / roundLevel;
    return <p className={styles.info}>Latest readings for {name}: {value}˚C</p>;
  } else {
    return <p className={styles.info}>No Readings for {name}</p>;
  }
}

export default LatestInfo;
