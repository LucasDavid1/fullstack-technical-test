from rest_framework import serializers
from users.models import User, Animal, Adoption


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'role', 'status']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class AdoptionSerializer(serializers.ModelSerializer):
    status = serializers.CharField(max_length=20, default='in_process')
    animal = serializers.StringRelatedField()
    adopter = serializers.StringRelatedField()
    volunteer = serializers.StringRelatedField() 

    class Meta:
        model = Adoption
        fields = '__all__'  
        read_only_fields = ['status', 'animal', 'adopter']


class AnimalSerializer(serializers.ModelSerializer):
    adoption = AdoptionSerializer(read_only=True, many=True)
    adoptionId = serializers.SerializerMethodField()

    class Meta:
        model = Animal
        fields = '__all__'

    def get_adoptionId(self, obj):
        if obj.adoption_set.exists():
            return obj.adoption_set.first().id
        return None
