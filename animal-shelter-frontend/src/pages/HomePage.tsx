import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Text, Button, Container, Grid, Loader, Group, ActionIcon, Table } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { fetchAnimals, applyForAdoption, processAdoption, fetchAdopters, fetchAdopterAdoptions } from '../services/api';
import { Adopter, Adoption } from '../types';
import { useAuth } from '../context/AuthContext';


interface Animal {
  id: number;
  name: string;
  image: string;
  status: string;
  adoptionId: number | null;
}

const HomePage: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [adopters, setAdopters] = useState<Adopter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [adopterAdoptions, setAdopterAdoptions] = useState<Adoption[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User:', user);
    const loadAnimals = async () => {
      setLoading(true);
      try {
        const data = await fetchAnimals();
        setAnimals(data);
        if (user && user.role === 'adopter') { 
          const adoptionData = await fetchAdopterAdoptions();
          console.log("adoptionData", adoptionData)
          setAdopterAdoptions(adoptionData);
        }
        if (user && user.role === 'volunteer') {
          const adopterData = await fetchAdopters();
          setAdopters(adopterData);
        }
      } catch (error) {
        console.error('Failed to fetch animals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnimals();
  }, [user]);

  const handleApplyForAdoption = async (animalId: number) => {
    try {
      await applyForAdoption(animalId);
      fetchAnimals().then(data => setAnimals(data)); 
    } catch (error) {
      console.error('Error applying for adoption:', error);

    }
  };

  const handleProcessAdoption = async (animal: Animal, action: 'accept' | 'reject') => {
    if (animal.adoptionId !== null) {
      try {
        await processAdoption(animal.adoptionId, action);
        fetchAnimals().then(data => setAnimals(data));
      } catch (error) {
        console.error(`Error ${action}ing adoption:`, error);
      }
    } else {
      console.error('No adoption data available for the animal');
    }
  };

  const renderAnimals = () => (
    <Grid>
      {animals.map((animal) => (
        <Grid.Col key={animal.id} span={4}>
          <Card shadow="sm" padding="lg">
            <Text>{animal.name}</Text>
            <Text>{animal.status}</Text>
            {user && user.role === 'adopter' && animal.status === 'for_adoption' && (
              <Button fullWidth mt="md" onClick={() => handleApplyForAdoption(animal.id)}>
                Apply for Adoption 
              </Button>
            )}
  
            {/* Volunteer actions */}
            {user && user.role === 'volunteer' && (
              <>
                {/* Adoption processing buttons */}
                {animal.status === 'waiting' && ( 
                  <Group mt="md">
                    <Button
                      variant="outline"
                      color="green"
                      onClick={() => handleProcessAdoption(animal, 'accept')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      color="red"
                      onClick={() => handleProcessAdoption(animal, 'reject')}
                    >
                      Reject
                    </Button>
                  </Group>
                )}
              </>
            )}
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );

  const renderAdoptersTable = () => (
    <>
    <Text size="xl" mt="md">Adopters</Text> 
    <Table mt="md" miw={700}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Username</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {adopters.map((adopter) => (
          <Table.Tr key={adopter.id}>
            <Table.Td>{adopter.id}</Table.Td>
            <Table.Td>{adopter.username}</Table.Td>
            <Table.Td>{adopter.email}</Table.Td>
            <Table.Td>{adopter.status}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
    </>
  );

  const renderAdopterAdoptionsTable = () => (
    <>
      <Text size="xl" mt="md">My Adoptions</Text>
      <Table mt="md" miw={700}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Animal</Table.Th>
            <Table.Th>Adoption Date</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {adopterAdoptions.map((adoption) => (
            <Table.Tr key={adoption.id}>
              <Table.Td>{adoption.id}</Table.Td>
              <Table.Td>{adoption.animal.toString()}</Table.Td>
              <Table.Td>{adoption.adoption_date}</Table.Td>
              <Table.Td>{adoption.status}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );

  if (loading) {
    return <Loader size="xl" />;
  }

  return (
    <Container>
      <Text size="xl" mb="lg">
        Animals Available for Adoption
      </Text>
      {renderAnimals()}
      {user && user.role === 'adopter' && renderAdopterAdoptionsTable()}
      {user && user.role === 'volunteer' && renderAdoptersTable()} 
      {user && user.role === 'admin' && (
        <Button
        fullWidth
        mt="md"
        onClick={() => navigate('/admin')}
      >
        <ActionIcon>
          <IconSettings size={18} />
        </ActionIcon>
        Admin Management
      </Button>
      )} 
    </Container>
  );
};

export default HomePage;
