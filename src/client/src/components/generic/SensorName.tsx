import React from 'react';

export interface Props {
  sensor: Api.Sensor.Get;
}

function SensorName(props: Props) {
  return <>{props.sensor.desc} ({props.sensor.serialNum})</>;
}

export default SensorName;
