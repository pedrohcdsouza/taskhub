FROM python:3.11

WORKDIR /app


COPY requirements.txt /app/requirements.txt

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app


EXPOSE 8000
