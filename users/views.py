from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied

from users.serializers import UserSerializer, AnimalSerializer, AdoptionSerializer
from users import services as user_services


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        # Generate token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        user_data = {
            'username': user.username,
            'role': 'admin' if user.is_superuser else user.role,
        }

        return Response({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user_data
        }, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def register_user(request):
    data = request.data
    user_serializer = UserSerializer(data=data)
    if user_serializer.is_valid():
        user = user_serializer.save()
        return Response({'message': f'User {user.username} registered successfully'}, status=status.HTTP_201_CREATED)
    else:
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AnimalCreateView(generics.CreateAPIView):
    queryset = user_services.get_all_animals()
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AnimalListView(generics.ListAPIView):
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied('User is not authenticated.')

        return user_services.get_animals_for_user(user).prefetch_related('adoption_set')


class AnimalUpdateView(generics.UpdateAPIView):
    queryset = user_services.get_all_animals()
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class AnimalDeleteView(generics.DestroyAPIView):
    queryset = user_services.get_all_animals()
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


# Volunteers CRUD
class VolunteerListCreateView(generics.ListCreateAPIView):
    queryset = user_services.get_users_by_role('volunteer')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class VolunteerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = user_services.get_users_by_role('volunteer')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


# Adopters CRUD
class AdopterListCreateView(generics.ListCreateAPIView):
    queryset = user_services.get_users_by_role('adopter')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdopterDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = user_services.get_users_by_role('adopter')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


# Adoptions CRUD
class AdoptionListCreateView(generics.ListCreateAPIView):
    queryset = user_services.get_all_adoptions()
    serializer_class = AdoptionSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdoptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = user_services.get_all_adoptions()
    serializer_class = AdoptionSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class CreateAdoptionView(generics.CreateAPIView):
    queryset = user_services.get_all_adoptions()
    serializer_class = AdoptionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        adopter = self.request.user
        animal_id = self.request.data.get('animal_id')
        serializer.save(adopter=adopter, animal_id=animal_id)


class ApplyForAdoptionView(generics.CreateAPIView):
    queryset = user_services.get_all_adoptions()
    serializer_class = AdoptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        adopter = self.request.user
        animal_id = self.request.data.get('animal_id')

        animal = user_services.get_animal_by_id_and_status(animal_id, 'for_adoption')
        if user_services.check_adoption_exists(adopter, animal, 'in_process'):
            raise PermissionDenied('You already have a pending adoption request for this animal.')

        if animal is None:
            raise PermissionDenied('Animal not found or not available for adoption.')

        animal.status = 'waiting'  # Set animal status to waiting
        animal.save()
        # Create Adoption record with null volunteer
        serializer.save(adopter=adopter, animal=animal)


class ProcessAdoptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        adoption = get_object_or_404(user_services.get_all_adoptions(), pk=pk)

        if request.user.is_volunteer():
            action = request.data.get('action')
            if action == 'accept':
                adoption.status = 'completed'
                adoption.volunteer = request.user
                adoption.animal.status = 'adopted'
                adoption.animal.save()
                adoption.save()
                return Response({"message": "Adoption approved successfully."}, status=status.HTTP_200_OK)
            elif action == 'reject':
                adoption.animal.status = 'for_adoption'
                adoption.animal.save()
                adoption.delete()
                return Response({"message": "Adoption rejected."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid action. Choose 'accept' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
