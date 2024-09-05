import React, { useState, useEffect } from 'react';
import { Button, TextInput, Select, NumberInput, Group } from '@mantine/core';
import { createAnimal, updateAnimal } from '../../services/api';
import { AnimalType, AnimalStatus, ANIMAL_TYPES, ANIMAL_STATUSES } from '../../constants';

interface Animal {
  id: number;
  name: string;
  status: AnimalStatus;
  breed: string;
  animal_type: AnimalType;
  age: number;
}

interface AnimalCRUDProps {
    onCreate?: () => void;
    animalToEdit?: Animal | null;
    onEdit?: () => void;
  }

const AnimalCRUD: React.FC<AnimalCRUDProps> = ({ onCreate, onEdit, animalToEdit }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<AnimalStatus>('for_adoption');
  const [breed, setBreed] = useState('');
  const [animalType, setAnimalType] = useState<AnimalType>('dog');
  const [age, setAge] = useState(0);

  useEffect(() => {
    if (animalToEdit) {
      setName(animalToEdit.name);
      setStatus(animalToEdit.status);
      setBreed(animalToEdit.breed);
      setAnimalType(animalToEdit.animal_type);
      setAge(animalToEdit.age);
    }
  }, [animalToEdit]);

  const handleCreateAnimal = async () => {
    try {
      await createAnimal({
        name,
        status,
        breed,
        animal_type: animalType,
        age,
      });

      setName('');
      setStatus('for_adoption');
      setBreed('');
      setAnimalType('dog');
      setAge(0);
      if (onCreate) {
        onCreate();
      }
      alert('Animal created successfully!');
    } catch (error) {
      console.error('Failed to create animal:', error);
      alert('Failed to create animal. Please try again.');
    }
  };

  const handleUpdateAnimal = async () => {
    if (animalToEdit) {
      try {
        await updateAnimal(animalToEdit.id, {
          name,
          breed,
          age,
          animal_type: animalType,
        });

        onEdit?.();
        alert('Animal updated successfully!');
      } catch (error) {
        console.error('Failed to update animal:', error);
        alert('Failed to update animal. Please try again.');
      }
    }
  };

  return (
    <div>
      <TextInput
        label="Name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <Select
        label="Status"
        value={status}
        onChange={(value) => setStatus(value as AnimalStatus)}
        data={ANIMAL_STATUSES}
      />
      <TextInput
        label="Breed"
        value={breed}
        onChange={(e) => setBreed(e.currentTarget.value)}
      />
      <Select
        label="Animal Type"
        value={animalType}
        onChange={(value) => setAnimalType(value as AnimalType)}
        data={ANIMAL_TYPES}
      />
      <NumberInput
        label="Age"
        value={age}
        onChange={(value) => setAge(value !== null ? Number(value) : 0)}
        min={0}
      />
      <Group mt="md">
        {animalToEdit ? (
          <Button onClick={handleUpdateAnimal}>Update</Button>
        ) : (
          <Button onClick={handleCreateAnimal}>Create</Button>
        )}
      </Group>
    </div>
  );
};

export default AnimalCRUD;
