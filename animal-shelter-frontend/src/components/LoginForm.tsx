import React from 'react';
import { Box, Title, Button, TextInput, PasswordInput, Text, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showNotification } from '@mantine/notifications';


const LoginForm: React.FC = () => {
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length < 2 ? 'Username must have at least 2 characters' : null),
      password: (value) => (value.length < 6 ? 'Password must have at least 6 characters' : null),
    },
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const data = await loginUser(values);
      login(data.access_token, data.user);
      console.log('Login successful:', data);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      showNotification({
        title: 'Login failed',
        message: 'Incorrect username or password. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <Box maw={300} mx="auto">
      <Title order={2} ta="center" mt="md" mb="md">
        Login
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Username"
          placeholder="Enter your username"
          {...form.getInputProps('username')}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          {...form.getInputProps('password')}
          required
        />
        <Button type="submit">Login</Button>
      </form>
      <Text mt="sm">
        Don't have an account?{' '}
        <Anchor href="/register" size="sm">
          Register
        </Anchor>
      </Text>
    </Box>
  );
};

export default LoginForm;
