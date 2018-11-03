const baseDomain = process.env.NODE_ENV === 'development' ? 'http://localhost' : '';
const apiUrl = `${baseDomain}/api/v1`;
const sensorUrl = `${apiUrl}/sensors`;
const readingPart = 'readings';

async function doFetch(url: string, method = 'get', body?: object) {
  const resp = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!resp.ok) {
    throw new Error('Invalid response code');
  }
  return resp.json();
}

export function fetchSensors() {
  return doFetch(sensorUrl);
}

export function fetchReadings(sensor: number) {
  // tslint:disable-next-line:no-magic-numbers
  const dayInSecs = 24 * 3600 * 1000;
  const begin = new Date(Date.now() - dayInSecs);
  return doFetch(`${sensorUrl}/${sensor}/${readingPart}?begin=${begin.toISOString()}`);
}

export function updateSensor(sensor: number, data: Api.Sensor.Patch) {
  return doFetch(`${sensorUrl}/${sensor}`, 'patch', data);
}
