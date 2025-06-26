from api.models import Task

def get_task_list():
    
    return Task.objects.all().order_by('datetime')