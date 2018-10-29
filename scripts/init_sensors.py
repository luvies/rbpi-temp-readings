#! /usr/bin/env python3
import json

import requests
import storage

SENSORS = {
    "28-021480e954ff": "primary flow",
    "28-021480eb02ff": "primary return",
    "28-0317248037ff": "DHW",
    "28-03172481a3ff": "spare1",
    "28-0317248ff2ff": "spare2"
}


def create_sensor(serial_num, desc):
    data = {
        "serialNum": serial_num,
        "desc": desc
    }
    requests.post(storage.SENSORS_URL, json=data)


def init_sensors():
    for k, v in SENSORS.items():
        create_sensor(k, v)


if __name__ == "__main__":
    init_sensors()
    print("Loaded default sensors into database")
