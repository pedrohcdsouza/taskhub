from django.shortcuts import render
from django.http import JsonResponse
from api.services import get_task_list

def task_list(request):

    tasks = get_task_list()

    return JsonResponse({
        tasks: list(tasks.values('id', 'title', 'datetime'))
    }, safe=False)


    