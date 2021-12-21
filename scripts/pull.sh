#!/bin/bash

cd ~/bank-of-brobots-api

git reset --hard
git clean -f -d
git pull --rebase

pipenv install --deploy
pipenv run flask db upgrade

cp scripts/api.service ~/.config/systemd/user/bank-of-brobots-api.service
systemctl --user daemon-reload
systemctl --user restart bank-of-brobots-api.service
