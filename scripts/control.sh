#! /bin/bash

SESSION_NAME=readings_server
SERVER_EXE=./server/rbpi-readings-server.js
DB_DIR=./database
DB_FILE=$DB_DIR/readings.db

if [[ $1 == "start" || $1 == "up" ]]; then
    echo "Starting server..."
    mkdir -p $DB_DIR
    tmux new-session -d -n $SESSION_NAME "PORT=80 DB_FILE_PATH=$DB_FILE node $SERVER_EXE"
elif [[ $1 == "stop" || $1 == "down" ]]; then
    echo "Stopping server..."
    tmux send-keys -t $SESSION_NAME C-c
else
    echo "This script will control the readings server"
    echo -e "\tstart | up\tbrings up the server"
    echo -e "\tstop | down\tbrings down the server"
fi
