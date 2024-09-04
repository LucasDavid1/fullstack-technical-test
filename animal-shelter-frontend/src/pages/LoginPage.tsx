import React from 'react';
import { Container, Title, Text, TextInput, PasswordInput, Button } from '@mantine/core';

const LoginPage: React.FC = () => {
  return (
    <Container size="xs" style={{ marginTop: '20vh' }}>
      <Text>
        <Title>Login</Title>
      </Text>
      <TextInput label="Email" placeholder="Enter your email" required mt="md" />
      <PasswordInput label="Password" placeholder="Enter your password" required mt="md" />
      <Button fullWidth mt="xl">Login</Button>
    </Container>
  );
};

export default LoginPage;