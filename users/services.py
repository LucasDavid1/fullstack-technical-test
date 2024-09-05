from django.http import HttpResponse
from users.models import Animal, User, Adoption


def ping(request):
    return HttpResponse("Pong")


def get_user_by_username(username):
    try:
        return User.objects.get(username=username)
    except User.DoesNotExist:
        return None


def get_all_animals():
    return Animal.objects.all()


def get_animals_for_user(user: User):
    if user.is_superuser or user.role == "volunteer":
        return Animal.objects.all()
    else:
        return Animal.objects.filter(status='for_adoption')

def get_users_by_role(role):
    return User.objects.filter(role=role)

def get_all_adoptions():
    return Adoption.objects.all()


def get_animal_by_id_and_status(animal_id, status):
    try:
        return Animal.objects.get(id=animal_id, status=status)
    except Animal.DoesNotExist:
        return None
    
def check_adoption_exists(adopter, animal, status):
    return Adoption.objects.filter(adopter=adopter, animal=animal, status=status).exists()


