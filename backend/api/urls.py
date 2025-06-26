from django.urls import path

urlpatterns = [
    path('tasklist/', 'api.views.task_list', name='task_list'),
]
