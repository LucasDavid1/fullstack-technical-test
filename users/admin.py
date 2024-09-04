from django.contrib import admin
from users.models import User, Animal, Adoption


admin.site.register(User)
admin.site.register(Animal)
admin.site.register(Adoption)
