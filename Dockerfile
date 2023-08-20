FROM tiangolo/uwsgi-nginx-flask:python3.8-alpine
RUN apk --update add bash nano
ENV STATIC_URL /static
ENV STATIC_PATH /static
COPY ./requirements.txt ./requirements.txt
COPY app.py ./app.py
RUN pip install -r ./requirements.txt
RUN export FLASK_APP=app.
RUN flask run