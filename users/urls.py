from django.urls import path
from users import services as user_services
from users import views as user_views


urlpatterns = [
    path('ping/', user_services.ping, name='ping'),
    path('login/', user_views.login_view, name='login'),
    path('register/', user_views.register_user, name='register_user'),

    # Animals
    path('animals/', user_views.AnimalListView.as_view(), name='animal-list'),
    path('animals/create/', user_views.AnimalCreateView.as_view(), name='animal-create'),
    path('animals/<int:pk>/update/', user_views.AnimalUpdateView.as_view(), name='animal-update'),
    path('animals/<int:pk>/delete/', user_views.AnimalDeleteView.as_view(), name='animal-delete'),

    # Volunteers
    path('volunteers/', user_views.VolunteerListCreateView.as_view(), name='volunteer-list-create'),
    path('volunteers/<int:pk>/', user_views.VolunteerDetailView.as_view(), name='volunteer-detail'),

    # Adopters
    path('adopters/', user_views.AdopterListCreateView.as_view(), name='adopter-list-create'),
    path('adopters/<int:pk>/', user_views.AdopterDetailView.as_view(), name='adopter-detail'),

    # Adoptions 
    path('adoptions/', user_views.AdoptionListCreateView.as_view(), name='adoption-list-create'),
    path('adoptions/<int:pk>/', user_views.AdoptionDetailView.as_view(), name='adoption-detail'), 
    path('adoptions/apply/', user_views.ApplyForAdoptionView.as_view(), name='apply-adoption'),
    path('adoptions/<int:pk>/process/', user_views.ProcessAdoptionView.as_view(), name='process-adoption'),
]
