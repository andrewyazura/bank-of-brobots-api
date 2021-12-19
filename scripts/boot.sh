#!/bin/bash

cd ~/bank-of-brobots-api

pipenv run gunicorn -w 4 -b :5000 app:app
