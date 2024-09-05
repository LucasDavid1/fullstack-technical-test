import React, { useState, useEffect } from 'react';
import { Button, TextInput, Select, Group, PasswordInput } from '@mantine/core';
import { createVolunteer, updateVolunteer } from '../../services/api';

interface Volunteer {
  id: number;
  username: string;
  email: string;
  status: string;
}

interface VolunteerCRUDProps {
  onCreate?: () => void;
  volunteerToEdit?: Volunteer | null;
  onEdit?: () => void;
}

const VOLUNTEER_STATUSES = ['active', 'inactive'];

const VolunteerCRUD: React.FC<VolunteerCRUDProps> = ({ onCreate, onEdit, volunteerToEdit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('active');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (volunteerToEdit) {
      setUsername(volunteerToEdit.username);
      setEmail(volunteerToEdit.email);
      setStatus(volunteerToEdit.status);
    }
  }, [volunteerToEdit]);

  const handleCreateVolunteer = async () => {
    try {
      await createVolunteer({
        username,
        email,
        status,
        password,
      });

      setUsername('');
      setEmail('');
      setStatus('active');
      setPassword('');
      if (onCreate) {
        onCreate();
      }
      alert('Volunteer created successfully!');
    } catch (error) {
      console.error('Failed to create volunteer:', error);
      alert('Failed to create volunteer. Please try again.');
    }
  };

  const handleUpdateVolunteer = async () => {
    if (volunteerToEdit) {
      try {
        const updatedData = {
          username,
          email,
          status,
          ...(password && { password }),
        };

        await updateVolunteer(volunteerToEdit.id, updatedData);

        onEdit?.();
        alert('Volunteer updated successfully!');
      } catch (error) {
        console.error('Failed to update volunteer:', error);
        alert('Failed to update volunteer. Please try again.');
      }
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
        data={VOLUNTEER_STATUSES}
      />
      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        placeholder={volunteerToEdit ? "Leave blank to keep current password" : "Set password"}
      />
      <Group mt="md">
        {volunteerToEdit ? (
          <Button onClick={handleUpdateVolunteer}>Update</Button>
        ) : (
          <Button onClick={handleCreateVolunteer}>Create</Button>
        )}
      </Group>
    </div>
  );
};

export default VolunteerCRUD;
