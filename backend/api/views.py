from django.shortcuts import render
from django.http import JsonResponse
from api.services import get_task_list, create_task, edit_task

def task_list(request):

    tasks = get_task_list()

    return JsonResponse({
        tasks: list(tasks.values('id', 'title', 'datetime'))
    }, safe=False)

def task_create(request):

    if request.method == 'POST':

        title = request.POST.get('title')
        datetime = request.POST.get('datetime')

        if title and datetime:
            
            task = create_task(title, datetime)
            return JsonResponse({
                'id': task.id,
                'title': task.title,
                'datetime': task.datetime.isoformat()
            }, status=201)

        return JsonResponse({'error': 'Invalid data'}, status=400)

def task_edit(request):

    if request.method == 'POST':

        id = request.POST.get('id')
        title = request.POST.get('title')
        datetime = request.POST.get('datetime')

        if id and title and datetime:

            task = edit_task(id, title, datetime)

            if task:

                return JsonResponse({
                    'id': task.id,
                    'title': task.title,
                    'datetime': task.datetime.isoformat()
                }, status=200)
            
        return JsonResponse({'error': 'Invalid data'}, status=400)



    