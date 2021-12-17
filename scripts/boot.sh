cd ~/bank-of-brobots-api

pipenv run gunicorn -w 4 app:app
