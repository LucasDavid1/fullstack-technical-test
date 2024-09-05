import React, { useState, useEffect } from 'react';
import { Button, TextInput, Group, Select, PasswordInput } from '@mantine/core'; 
import { createAdopter, updateAdopter } from '../../services/api';
import { Adopter } from '../../types';

interface AdopterCRUDProps {
  onCreate?: () => void;
  onEdit?: () => void;
  adopterToEdit?: Adopter | null;
}

const AdopterCRUD: React.FC<AdopterCRUDProps> = ({ onCreate, onEdit, adopterToEdit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    if (adopterToEdit) {
      setUsername(adopterToEdit.username);
      setEmail(adopterToEdit.email);
      setStatus(adopterToEdit.status); 
    }
  }, [adopterToEdit]);

  const handleUpdateAdopter = async () => {
    if (adopterToEdit) {
      try {
        await updateAdopter(adopterToEdit.id, { 
          username, 
          email,
          status,
          ...(password && { password }),
        });
        onEdit?.(); 
        alert('Adopter updated successfully!');
      } catch (error) {
        console.error('Failed to update adopter:', error);
        alert('Failed to update adopter. Please try again.');
      }
    }
  };

  const handleCreateAdopter = async () => {
    try {
      await createAdopter({
        username,
        email,
        status,
        password,
      });

      setUsername('');
      setEmail('');
      setStatus('active');
      setPassword('');

      onCreate?.();
      alert('Adopter created successfully!');
    } catch (error) {
      console.error('Failed to create adopter:', error);
      alert('Failed to create adopter. Please try again.');
    }
  };

  return (
    <div>
      <TextInput
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.currentTarget.value)}
      />
      <TextInput
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <Select
        label="Status"
        value={status}
        onChange={(value) => setStatus(value as string)}
        data={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
      />
        <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
        />
      <Group mt="md">
        {adopterToEdit ? ( 
          <Button onClick={handleUpdateAdopter}>Update</Button>
        ) : (
          <Button onClick={handleCreateAdopter}>Create</Button> 
        )}
      </Group>
    </div>
  );
};

export default AdopterCRUD;