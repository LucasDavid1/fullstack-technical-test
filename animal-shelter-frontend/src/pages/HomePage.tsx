import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Text, Button, Container, Grid, Loader, Group } from '@mantine/core';
import { fetchAnimals, applyForAdoption, processAdoption } from '../services/api';
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
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User:', user);
    const loadAnimals = async () => {
      setLoading(true);
      try {
        const data = await fetchAnimals();
        console.log("fetchAnimals", data)
        setAnimals(data);
      } catch (error) {
        console.error('Failed to fetch animals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnimals();
  }, []);

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

  if (loading) {
    return <Loader size="xl" />;
  }

  return (
    <Container>
      <Text size="xl" mb="lg">
        Animals Available for Adoption
      </Text>
      {renderAnimals()}
      {user ? (
        user.role === 'admin' ? (
          <Button 
            fullWidth
            mt="md"
            onClick={() => navigate('/admin')}
            >
            Admin Actions
          </Button>
        ) : user.role === 'volunteer' ? (
          <Button fullWidth mt="md">
            Volunteer Actions
          </Button>
        ) : user.role === 'adopter' ? (
          <Button fullWidth mt="md">
            Adopter Actions
          </Button>
        ) : (
          <Text>Unknown User Role</Text> 
        )
      ) : (
        <Text>Loading user data...</Text>
      )}
    </Container>
  );
};

export default HomePage;
