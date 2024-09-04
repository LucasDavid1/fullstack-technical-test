import React, { useState } from 'react';
import { Button, Text } from '@mantine/core';
import { ping } from '../services/api';

const PingTest: React.FC = () => {
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePing = async () => {
    try {
      const result = await ping();
      setPingResult(result);
      setError(null);
    } catch (err) {
      setError('Failed to ping server');
      setPingResult(null);
    }
  };

  return (
    <div>
      <Button onClick={handlePing}>Ping Server</Button>
      {pingResult && <Text>Server response: {pingResult}</Text>}
      {error && <Text c="red">{error}</Text>}
    </div>
  );
};

export default PingTest;
