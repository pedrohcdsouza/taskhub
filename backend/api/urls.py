from django.urls import path
from api.views import task_list, task_create, task_edit, task_delete


urlpatterns = [
    path('tasklist/', task_list, name='task_list'),
    path('taskcreate/', task_create, name='task_create'),
    path('taskedit/', task_edit, name='task_edit'),
    path('taskdelete/', task_delete, name='task_delete'),
]
