from django.shortcuts import render
from django.http import JsonResponse
from api.services import get_task_list, create_task, edit_task, delete_task
import json
from django.views.decorators.csrf import ensure_csrf_cookie

# Returns the list of all tasks as JSON
@ensure_csrf_cookie
def task_list(request):
    tasks = get_task_list()
    return JsonResponse({
        'tasks': list(tasks.values('id', 'title', 'datetime'))
    }, safe=False)

# Creates a new task from JSON data (expects title and datetime)
@ensure_csrf_cookie
def task_create(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse JSON body
        except Exception:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        title = data.get('title')
        datetime = data.get('datetime')
        if title and datetime:
            try:
                task = create_task(title, datetime)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=400)
            return JsonResponse({
                'id': task.id,
                'title': task.title,
                'datetime': task.datetime.isoformat()
            }, status=201)
        return JsonResponse({'error': 'Invalid data'}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# Edits an existing task (expects id, title, and datetime in JSON)
@ensure_csrf_cookie
def task_edit(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        id = data.get('id')
        title = data.get('title')
        datetime = data.get('datetime')
        if id and title and datetime:
            task = edit_task(id, title, datetime)
            if task:
                return JsonResponse({
                    'id': task.id,
                    'title': task.title,
                    'datetime': task.datetime.isoformat()
                }, status=200)
        return JsonResponse({'error': 'Invalid data'}, status=400)

# Deletes a task by id (expects id in JSON)
@ensure_csrf_cookie
def task_delete(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        id = data.get('id')
        if id:
            deleted = delete_task(id)
            if deleted:
                return JsonResponse({'message': 'Task deleted successfully'}, status=200)
            return JsonResponse({'error': 'Task not found'}, status=404)
        return JsonResponse({'error': 'Invalid data'}, status=400)



