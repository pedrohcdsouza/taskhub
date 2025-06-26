from api.models import Task

def get_task_list():

    return Task.objects.all().order_by('datetime')

def create_task(title, datetime):

    task = Task(title=title, datetime=datetime)
    task.save()
    
    return task