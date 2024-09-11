import React, { useState, useEffect } from 'react';
import { Box, Button, Table, Title, Modal, Group, ActionIcon } from '@mantine/core';
import '@mantine/core/styles.css';
import { IconEdit, IconTrash, IconDog, IconUsers, IconUser, IconHeartSpark } from '@tabler/icons-react';
import { fetchAnimals, deleteAnimal, fetchVolunteers, deleteVolunteer, fetchAdopters, deleteAdopter, fetchAdoptions, deleteAdoption } from '../services/api'; 
import AnimalCRUD from './admin/AnimalCRUD';
import VolunteerCRUD from './admin/VolunteersCRUD';
import AdoptionCRUD from './admin/AdoptionsCRUD';
import AdopterCRUD from './admin/AdopterCRUD';
import { AnimalType, AnimalStatus } from '../constants';

interface Animal {
  id: number;
  name: string;
  age: number;
  breed: string;
  animal_type: AnimalType;
  status: AnimalStatus;
}

interface Volunteer {
  id: number;
  username: string;
  email: string;
  status: string;
}

interface Adopter {
  id: number;
  username: string;
  email: string;
  status: string;
}

interface Adoption {
  id: number;
  animal: Animal;
  adopter: Adopter;
  volunteer: Volunteer;
  adoption_date: string;
  status: string;
}

const AdminPage: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [adopters, setAdopters] = useState<Adopter[]>([]);
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [animalToEdit, setAnimalToEdit] = useState<Animal | null>(null);

  const [isCreateVolunteerModalOpen, setIsCreateVolunteerModalOpen] = useState(false);
  const [isEditVolunteerModalOpen, setIsEditVolunteerModalOpen] = useState(false);
  const [volunteerToEdit, setVolunteerToEdit] = useState<Volunteer | null>(null);

  const [isCreateAdopterModalOpen, setIsCreateAdopterModalOpen] = useState(false);
  const [isEditAdopterModalOpen, setIsEditAdopterModalOpen] = useState(false);
  const [adopterToEdit, setAdopterToEdit] = useState<Adopter | null>(null);

  const [isCreateAdoptionModalOpen, setIsCreateAdoptionModalOpen] = useState(false);
  const [isEditAdoptionModalOpen, setIsEditAdoptionModalOpen] = useState(false);
  const [adoptionToEdit, setAdoptionToEdit] = useState<Adoption | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAnimals();
        setAnimals(data);

        const volunteerData = await fetchVolunteers();
        setVolunteers(volunteerData);

        const adopterData = await fetchAdopters();
        setAdopters(adopterData);

        const adoptionData = await fetchAdoptions();
        setAdoptions(adoptionData);
        console.log("adoptionData", adoptionData)
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateAnimalOpenModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    const fetchAnimalData = async () => {
      try {
        const data = await fetchAnimals();
        setAnimals(data);
      } catch (error) {
        console.error('Failed to fetch animals:', error);
      }
    };
    fetchAnimalData();
  };

  const handleEditAnimal = (animal: Animal) => {
    setAnimalToEdit(animal);
    setIsEditModalOpen(true);
  };

  const handleDeleteAnimal = async (animalId: number) => {
    try {
      await deleteAnimal(animalId);
      const updatedAnimals = await fetchAnimals();
      setAnimals(updatedAnimals);
      alert('Animal deleted successfully');
    } catch (error) {
      console.error('Failed to delete animal:', error);
      alert('Failed to delete animal');
    }
  };
  
  const handleEditVolunteer = (volunteer: Volunteer) => {
    setVolunteerToEdit(volunteer);
    setIsEditVolunteerModalOpen(true);
  };
  
  const handleCloseEditVolunteerModal = async () => {
    setIsEditVolunteerModalOpen(false);
    setVolunteers(await fetchVolunteers());
  };

  const handleCreateAdopterOpenModal = () => {
    setIsCreateAdopterModalOpen(true);
  };

  const handleCloseAdopterModal = async () => {
    setIsCreateAdopterModalOpen(false);
    setAdopters(await fetchAdopters());
  };

  return (
    <Box maw={600} mx="auto">      
      <Box maw={600} mx="auto">      
        <Group>
          <ActionIcon variant="transparent"> <IconDog size={24} /> </ActionIcon> 
          <Title order={2}>Animals</Title> 
        </Group>
        <Button onClick={handleCreateAnimalOpenModal}>Create New Animal</Button>
      </Box>

      {/* Table to display animals */}
      <Table miw={700}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Age</Table.Th>
          <Table.Th>Breed</Table.Th>
          <Table.Th>Animal Type</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {animals.map((animal) => (
          <Table.Tr key={animal.id}>
            <Table.Td>{animal.id}</Table.Td>
            <Table.Td>{animal.name}</Table.Td>
            <Table.Td>{animal.age}</Table.Td>
            <Table.Td>{animal.breed}</Table.Td>
            <Table.Td>{animal.animal_type}</Table.Td>
            <Table.Td>{animal.status}</Table.Td>
            <Table.Td>
              <Group>
                <ActionIcon 
                  color="blue" 
                  onClick={() => handleEditAnimal(animal)} 
                  variant="hover"
                >
                  <IconEdit size={16} /> 
                </ActionIcon>
                <ActionIcon 
                  color="red" 
                  onClick={() => handleDeleteAnimal(animal.id)} 
                  variant="hover"
                >
                  <IconTrash size={16} /> 
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>

      <Modal
        opened={isCreateModalOpen}
        onClose={handleCloseModal}
        title="Create New Animal"
      >
        <AnimalCRUD onCreate={handleCloseModal} />
      </Modal>

      <Modal
        opened={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Animal"
      >
        <AnimalCRUD 
          animalToEdit={animalToEdit} 
          onEdit={() => { 
            setIsEditModalOpen(false); 
            fetchAnimals().then(data => setAnimals(data));
          }} 
        /> 
      </Modal>

      <Box maw={600} mx="auto">      
        <Group>
          <ActionIcon variant="transparent"> <IconUsers size={24} /> </ActionIcon> 
          <Title order={2}>Volunteers</Title> 
        </Group>
        <Button onClick={() => setIsCreateVolunteerModalOpen(true)}>Create New Volunteer</Button>
      </Box>
      
      <Table miw={700}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {volunteers.map((volunteer) => (
            <Table.Tr key={volunteer.id}>
              <Table.Td>{volunteer.id}</Table.Td>
              <Table.Td>{volunteer.username}</Table.Td>
              <Table.Td>{volunteer.email}</Table.Td>
              <Table.Td>{volunteer.status}</Table.Td>
              <Table.Td>
                <Group>
                  <ActionIcon
                    color="blue"
                    onClick={() => {
                      setVolunteerToEdit(volunteer);
                      setIsEditVolunteerModalOpen(true);
                    }}
                    variant="hover"
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    onClick={async () => {
                      await deleteVolunteer(volunteer.id);
                      setVolunteers(await fetchVolunteers());
                    }}
                    variant="hover"
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={isCreateVolunteerModalOpen}
        onClose={() => setIsCreateVolunteerModalOpen(false)}
        title="Create New Volunteer"
      >
        <VolunteerCRUD onCreate={() => {
          setIsCreateVolunteerModalOpen(false);
          fetchVolunteers().then(data => setVolunteers(data));
        }} />
      </Modal>

      <Modal
        opened={isEditVolunteerModalOpen}
        onClose={() => setIsEditVolunteerModalOpen(false)}
        title="Edit Volunteer"
      >
        <VolunteerCRUD
          volunteerToEdit={volunteerToEdit}
          onEdit={() => {
            setIsEditVolunteerModalOpen(false);
            fetchVolunteers().then(data => setVolunteers(data));
          }}
        />
      </Modal>

      <Box maw={600} mx="auto">      
        <Group>
          <ActionIcon variant="transparent"> <IconUser size={24} /> </ActionIcon> 
          <Title order={2}>Adopters</Title> 
        </Group>
        <Button onClick={() => setIsCreateAdopterModalOpen(true)}>Create New Adopter</Button>
      </Box>
      <Table miw={700}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {adopters.map((adopter) => (
            <Table.Tr key={adopter.id}>
              <Table.Td>{adopter.id}</Table.Td>
              <Table.Td>{adopter.username}</Table.Td>
              <Table.Td>{adopter.email}</Table.Td>
              <Table.Td>{adopter.status}</Table.Td>
              <Table.Td>
                <Group>
                  <ActionIcon
                    color="blue"
                    onClick={() => {
                      setAdopterToEdit(adopter);
                      setIsEditAdopterModalOpen(true);
                    }}
                    variant="hover"
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    onClick={async () => {
                      await deleteAdopter(adopter.id);
                      setAdopters(await fetchAdopters());
                    }}
                    variant="hover"
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={isCreateAdopterModalOpen}
        onClose={handleCloseAdopterModal}
        title="Create New Adopter"
      >
        <AdopterCRUD onCreate={handleCloseAdopterModal} /> 
      </Modal>
      <Modal
        opened={isEditAdopterModalOpen}
        onClose={() => setIsEditAdopterModalOpen(false)}
        title="Edit Adopter"
      >
        <AdopterCRUD
          adopterToEdit={adopterToEdit}
          onEdit={() => {
            setIsEditAdopterModalOpen(false);
            fetchAdopters().then(data => setAdopters(data));
          }}
        />
      </Modal>

      <Box maw={600} mx="auto">      
        <Group>
          <ActionIcon variant="transparent"> <IconHeartSpark size={24} /> </ActionIcon> 
          <Title order={2}>Adoptions</Title> 
        </Group>
        <Button onClick={() => setIsCreateAdoptionModalOpen(true)}>Create New Adoption</Button>
      </Box>
      <Table miw={700}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Animal</Table.Th>
            <Table.Th>Adopter</Table.Th>
            <Table.Th>Volunteer</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {adoptions.map((adoption) => (
            <Table.Tr key={adoption.id}>
              <Table.Td>{adoption.id}</Table.Td>
              <Table.Td>{adoption.animal.toString()}</Table.Td>
              <Table.Td>{adoption.adopter.toString()}</Table.Td>
              <Table.Td>{adoption.volunteer?.toString()}</Table.Td>
              <Table.Td>{adoption.status}</Table.Td>
              <Table.Td>
                <Group>
                  <ActionIcon
                    color="blue"
                    onClick={() => {
                      setAdoptionToEdit(adoption);
                      setIsEditAdoptionModalOpen(true);
                    }}
                    variant="hover"
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    onClick={async () => {
                      await deleteAdoption(adoption.id);
                      setAdoptions(await fetchAdoptions());
                    }}
                    variant="hover"
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={isCreateAdoptionModalOpen}
        onClose={() => setIsCreateAdoptionModalOpen(false)}
        title="Create New Adoption"
      >
        <AdoptionCRUD onCreate={() => {
          setIsCreateAdoptionModalOpen(false);
          fetchAdoptions().then(data => setAdoptions(data));
        }} />
      </Modal>

      <Modal
        opened={isEditAdoptionModalOpen}
        onClose={() => setIsEditAdoptionModalOpen(false)}
        title="Edit Adoption"
      >
        <AdoptionCRUD 
          adoptionToEdit={adoptionToEdit}
          onEdit={() => {
            setIsEditAdoptionModalOpen(false);
            fetchAdoptions().then(data => setAdoptions(data));
          }} 
        /> 
      </Modal>
    </Box>
  );
};

export default AdminPage;