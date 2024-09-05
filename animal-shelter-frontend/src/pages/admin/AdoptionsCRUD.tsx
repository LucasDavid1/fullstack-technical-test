import React, { useState, useEffect } from 'react';
import { Button, Select, Group } from '@mantine/core';
import '@mantine/core/styles.css';
import { createAdoption, updateAdoption, fetchAnimals, fetchAdopters, fetchVolunteers } from '../../services/api';
import { ADOPTION_STATUSES, AdoptionStatus } from '../../constants';
import { Adoption, Animal, Adopter, Volunteer } from '../../types';

interface AnimalOption {
  value: string;
  label: string;
}

interface AdopterOption {
  value: string;
  label: string;
}

interface VolunteerOption {
  value: string;
  label: string;
}

interface AdoptionCRUDProps {
  onCreate?: () => void;
  onEdit?: () => void;
  adoptionToEdit?: Adoption | null;
}

const AdoptionCRUD: React.FC<AdoptionCRUDProps> = ({ onCreate, onEdit, adoptionToEdit }) => {
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [adopterId, setAdopterId] = useState<number | null>(null);
  const [volunteerId, setVolunteerId] = useState<number | null>(null);
  const [adoptionDate, setAdoptionDate] = useState<Date | null>(new Date()); // Default to current date
  const [status, setStatus] = useState<AdoptionStatus>('in_process');

  const [animals, setAnimals] = useState<AnimalOption[]>([]);
  const [adopters, setAdopters] = useState<AdopterOption[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const animalsData = await fetchAnimals();
        setAnimals(animalsData.map((animal: Animal) => ({
          value: animal.id.toString(),
          label: animal.name,
        })));

        const adoptersData = await fetchAdopters();
        setAdopters(adoptersData.map((adopter: Adopter) => ({
          value: adopter.id.toString(),
          label: adopter.username, // Assuming you want to display the username
        })));

        const volunteersData = await fetchVolunteers();
        setVolunteers(volunteersData.map((volunteer: Volunteer) => ({
          value: volunteer.id.toString(),
          label: volunteer.username, // Assuming you want to display the username
        })));
      } catch (error) {
        console.error('Failed to fetch data for adoptions:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (adoptionToEdit) {
      setAnimalId(adoptionToEdit.animal.id); // Assuming animal is an object with an id
      setAdopterId(adoptionToEdit.adopter.id); // Assuming adopter is an object with an id
      setVolunteerId(adoptionToEdit.volunteer.id); // Assuming volunteer is an object with an id
      setAdoptionDate(new Date(adoptionToEdit.adoption_date));
      setStatus(adoptionToEdit.status as AdoptionStatus);
    }
  }, [adoptionToEdit]);

  const handleCreateAdoption = async () => {
    try {
      await createAdoption({
        animal_id: animalId!,
        adopter_id: adopterId!,
        volunteer_id: volunteerId!,
        status,
      });

      setAnimalId(null);
      setAdopterId(null);
      setVolunteerId(null);
      setAdoptionDate(new Date());
      setStatus('in_process');

      if (onCreate) {
        onCreate();
      }
      alert('Adoption created successfully!');
    } catch (error) {
      console.error('Failed to create adoption:', error);
      alert('Failed to create adoption. Please try again.');
    }
  };

  const handleUpdateAdoption = async () => {
    if (adoptionToEdit) {
      try {
        await updateAdoption(adoptionToEdit.id, {
          animal: animalId!,
          adopter: adopterId!,
          volunteer: volunteerId!,
          adoption_date: adoptionDate!.toISOString().split('T')[0],
          status,
        });

        if (onEdit) {
          onEdit();
        }
        alert('Adoption updated successfully!');
      } catch (error) {
        console.error('Failed to update adoption:', error);
        alert('Failed to update adoption. Please try again.');
      }
    }
  };

  return (
    <div>
      <Select
        label="Animal"
        value={animalId?.toString()}
        onChange={(value) => setAnimalId(Number(value))}
        data={animals}
      />
      <Select
        label="Adopter"
        value={adopterId?.toString()}
        onChange={(value) => setAdopterId(Number(value))}
        data={adopters}
      />
      <Select
        label="Volunteer"
        value={volunteerId?.toString()}
        onChange={(value) => setVolunteerId(Number(value))}
        data={volunteers}
      />
      <label htmlFor="adoptionDate">Adoption Date:</label>
      <input 
        type="date" 
        id="adoptionDate" 
        value={adoptionDate ? adoptionDate.toISOString().split('T')[0] : ''}
        onChange={(e) => setAdoptionDate(e.target.value ? new Date(e.target.value) : null)} 
      />
      <Select
        label="Status"
        value={status}
        onChange={(value) => setStatus(value as AdoptionStatus)}
        data={ADOPTION_STATUSES}
      />
      <Group mt="md">
        {adoptionToEdit ? (
          <Button onClick={handleUpdateAdoption}>Update</Button>
        ) : (
          <Button onClick={handleCreateAdoption}>Create</Button>
        )}
      </Group>
    </div>
  );
};

export default AdoptionCRUD;