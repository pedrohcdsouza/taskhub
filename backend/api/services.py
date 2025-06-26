from api.models import Task

def get_task_list():

    return Task.objects.all().order_by('datetime')

def create_task(title, datetime):

    task = Task(title=title, datetime=datetime)
    task.save()

    return task

def edit_task(task_id, title, datetime):
    
    try:

        task = Task.objects.get(id=task_id)
        task.title = title
        task.datetime = datetime
        task.save()

        return task
    
    except Task.DoesNotExist:
        
        return None