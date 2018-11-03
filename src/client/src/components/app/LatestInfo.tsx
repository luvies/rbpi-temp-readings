import SensorName from 'components/generic/SensorName';
import React from 'react';

export interface Props {
  sensor: Api.Sensor.Get;
  readings: Api.Reading.Get[];
}

function LatestInfo(props: Props) {
  let value: number | undefined;

  if (props.readings.length > 0) {
    const roundLevel = 100;
    value = Math.round(props.readings[props.readings.length - 1].value * roundLevel) / roundLevel;
  }
  return (
    <tr>
      <td>
        <SensorName sensor={props.sensor} />
      </td>
      {typeof value !== 'undefined' ?
        <td>{value}˚C</td>
        :
        <td>No Readings</td>
      }
      <td />
    </tr>
  );
}

export default LatestInfo;
