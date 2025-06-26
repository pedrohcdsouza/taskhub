from django.db import models

class Task(models.Model):

    title = models.CharField(max_length=200, unique=True)
    datetime = models.DateTimeField()