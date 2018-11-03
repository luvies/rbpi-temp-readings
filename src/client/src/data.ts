const baseDomain = process.env.NODE_ENV === 'development' ? 'http://localhost' : '';
const apiUrl = `${baseDomain}/api/v1`;
const sensorUrl = `${apiUrl}/sensors`;
const readingPart = 'readings';

async function doFetch(url: string, method = 'GET', body?: object) {
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const resp = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });
  if (!resp.ok) {
    throw new Error('Invalid response code');
  }
  if (!body) {
    return resp.json();
  }
}

export function fetchSensors(): Promise<Api.Sensor.Get[]> {
  return doFetch(sensorUrl);
}

export function fetchReadings(sensor: number): Promise<Api.Reading.Get[]> {
  // tslint:disable-next-line:no-magic-numbers
  const dayInSecs = 24 * 3600 * 1000;
  const begin = new Date(Date.now() - dayInSecs);
  return doFetch(`${sensorUrl}/${sensor}/${readingPart}?begin=${begin.toISOString()}`);
}

export function updateSensor(sensor: number, data: Api.Sensor.Patch): Promise<void> {
  return doFetch(`${sensorUrl}/${sensor}`, 'PATCH', data);
}
