#! /usr/bin/env python3
import datetime
import json

import requests

BASE_URL = "http://localhost"
API_ENDPOINT = "api/v1"
SENSORS_ENDPOINT = "sensors"
READINGS_ENDPOINT = "readings"

SENSORS_URL = "{}/{}/{}".format(BASE_URL, API_ENDPOINT, SENSORS_ENDPOINT)


class Sensor:
    """
    An object that represtents a sensor.
    This object provides all the info that a sensor has, and methods to update
    the info and push readings that have been taken by it.

    Usage:

    sensor.serialNum -> (readonly) The serial number string.

    sensor.desc -> The description.

    sensor.push_reading(value) -> Pushes a new reading to the backing store, using the
    current time as the `takenAt` time.
    """

    def __init__(self, sensorObj):
        self._id = sensorObj['id']
        self._serialNum = sensorObj['serialNum']
        self._desc = sensorObj['desc']

    @property
    def serialNum(self):
        return self._serialNum

    @property
    def desc(self):
        return self._desc

    @desc.setter
    def desc(self, value):
        payload = {
            "desc": value
        }
        resp = requests.patch(
            "{}/{}".format(SENSORS_URL, self._id), json=payload)
        resp.raise_for_status()
        self._desc = value

    def push_reading(self, value, takenAt=None):
        if takenAt is None:
            takenAt = datetime.datetime.now()
        payload = {
            "value": value,
            "takenAt": takenAt.isoformat() + "Z"
        }
        resp = requests.post("{}/{}/{}".format(SENSORS_URL,
                                               self._id, READINGS_ENDPOINT), json=payload)
        resp.raise_for_status()

    def __repr__(self):
        return "Sensor({},{},{})".format(self._id, self.serialNum, self.desc)


def get_sensors():
    """
    Fetches a list of the sensors that are currently available.

    Returns a list of Sensor objects.
    """
    resp = requests.get(SENSORS_URL)
    resp.raise_for_status()
    sensors = []
    for sensor in resp.json():
        sensors.append(Sensor(sensor))
    return sensors


if __name__ == "__main__":
    print(get_sensors())
    # requests.post(SENSORS_URL, json={
    #     "serialNum": "serial-1",
    #     "desc": "desc 1"
    # }).raise_for_status()
    # resp = requests.get(SENSORS_URL).json()
    # print(resp)
    # sensors = []
    # for sensor in resp:
    #     sensors.append(Sensor(sensor))
    # print(sensors)
    # print(sensors[0].desc)
    # sensors[0].desc = "new desc"
    # print(requests.get(SENSORS_URL).json())
    # sensors[0].push_reading(16.765)
