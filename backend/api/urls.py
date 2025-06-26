from django.urls import path
from api.views import task_list as api_task_list

urlpatterns = [
    path('tasklist/', api_task_list, name='task_list'),
]
