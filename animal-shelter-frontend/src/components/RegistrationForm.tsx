import React from 'react';
import { TextInput, PasswordInput, Button, Box, Title, Select  } from '@mantine/core';
import '@mantine/core/styles.css';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';


const RegistrationForm: React.FC = () => {
  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      role: '',
    },
    validate: {
      username: (value) => (value.length < 2 ? 'Username must have at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must have at least 6 characters' : null),
      role: (value) => (!value ? 'Please select a role' : null),
    },
  });

  const navigate = useNavigate(); 

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const data = await registerUser(values);
      console.log('Registration successful:', data);
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Box maw={300} mx="auto">
        <Title order={2} ta="center" mt="md" mb="md">
        Register
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                label="Username"
                placeholder="Your username"
                {...form.getInputProps('username')}
                required
            />
            <TextInput
                label="Email"
                placeholder="your@email.com"
                mt="sm"
                {...form.getInputProps('email')}
                required
            />
            <PasswordInput
                label="Password"
                placeholder="Your password"
                mt="sm"
                {...form.getInputProps('password')}
                required
            />
            <Select
                label="Role"
                placeholder="Select your role"
                mt="sm"
                data={[
                { value: 'volunteer', label: 'Volunteer' },
                { value: 'adopter', label: 'Adopter' },
                ]}
                {...form.getInputProps('role')}
                required
            />
            <Button type="submit" fullWidth mt="xl">
                Register
            </Button>
        </form>
    </Box>
  );
};

export default RegistrationForm;