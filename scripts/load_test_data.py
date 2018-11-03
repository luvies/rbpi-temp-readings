#! /usr/bin/env python3
import asyncio
import datetime
import time
import json
import random
from concurrent.futures import ThreadPoolExecutor

import requests
import storage


def force_async(fn):
    '''
    turns a sync function to async function using threads
    :param sync function:
    :return async funciton:
    '''
    pool = ThreadPoolExecutor()

    def wrapper(*args, **kwargs):
        future = pool.submit(fn, *args, **kwargs)
        return asyncio.wrap_future(future)  # make it awaitable

    return wrapper


@force_async
def push_reading(sensor, value, takenAt):
    sensor.push_reading(value, takenAt)


async def main():
    sensors = storage.get_sensors()
    start = datetime.datetime.now() - datetime.timedelta(days=2)
    delta = datetime.timedelta(minutes=2.5)
    tasks = []
    for sensor in sensors:
        for i in range(500):
            tasks.append(
                push_reading(
                    sensor,
                    (random.random() * 15) + 10,
                    start + (delta * i)))
    await asyncio.gather(*tasks)


if __name__ == "__main__":
    start = time.time()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()
    end = time.time()
    print("Loaded test data in {}s".format(end-start))
