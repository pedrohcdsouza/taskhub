from api.models import Task
from datetime import datetime as dt

# Returns all tasks ordered by datetime
def get_task_list():
    return Task.objects.all().order_by('datetime')

# Creates a new task from title and ISO datetime string
# Raises ValueError if datetime is invalid
def create_task(title, datetime_str):
    try:
        # Parse ISO datetime string, handle 'Z' as UTC
        datetime_obj = dt.fromisoformat(datetime_str.replace("Z", "+00:00"))
    except Exception:
        datetime_obj = None
    if datetime_obj is None:
        raise ValueError("Data/hora inválida")
    task = Task(title=title, datetime=datetime_obj)
    task.save()
    return task

# Edits an existing task; returns updated task or None if not found/invalid
def edit_task(task_id, title, datetime_str):
    try:
        # Parse ISO datetime string
        datetime_obj = dt.fromisoformat(datetime_str.replace("Z", "+00:00"))
    except Exception:
        datetime_obj = None
    if datetime_obj is None:
        return None
    try:
        task = Task.objects.get(id=task_id)
        task.title = title
        task.datetime = datetime_obj
        task.save()
        return task
    except Task.DoesNotExist:
        return None

# Deletes a task by id; returns True if deleted, False if not found
def delete_task(task_id):
    try:
        task = Task.objects.get(id=task_id)
        task.delete()
        return True
    except:
        return False