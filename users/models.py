from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('volunteer', 'Volunteer'),
        ('adopter', 'Adopter'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"

    def is_admin(self):
        return self.role == 'admin'

    def is_volunteer(self):
        return self.role == 'volunteer'

    def is_adopter(self):
        return self.role == 'adopter'


class Animal(models.Model):
    TYPE_CHOICES = [
        ('dog', 'Dog'),
        ('cat', 'Cat'),
    ]
    STATUS_CHOICES = [
        ('adopted', 'Adopted'),
        ('for_adoption', 'For Adoption'),
        ('waiting', 'Waiting for Adoption'),
    ]

    name = models.CharField(max_length=100)
    age = models.IntegerField()
    breed = models.CharField(max_length=100)
    animal_type = models.CharField(max_length=5, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    def __str__(self):
        return self.name


class Adoption(models.Model):
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    adopter = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'adopter'}, related_name='adoptions_as_adopter')
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'volunteer'}, related_name='adoptions_as_volunteer', null=True, blank=True)
    adoption_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('completed', 'Completed'), ('in_process', 'In Process')])

    def __str__(self):
        return f"Adoption of {self.animal.name} by {self.adopter.username}"
