import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Box, Alert, SelectChangeEvent } from '@mui/material';

interface ApiResponse {
  status: string;
  code: number;
  ip: string;
}

const App: React.FC = () => {
  const [ruleDescription, setRuleDescription] = useState<string>('');
  const [ip, setIp] = useState<string>('');
  const [typeGroup, setTypeGroup] = useState<string>('prod');
  const [typeService, setTypeService] = useState<string>('mysql');
  const [message, setMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [verificationCode, setVerificationCode] = useState<string>('');

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/send-code`, { email: ruleDescription });
      setMessage('Código de verificação enviado para o email');
      setAlertType('success');
    } catch (error: any) {
      setMessage('Erro ao enviar código de verificação: ' + (error.response?.data.message || error.message));
      setAlertType('error');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post<ApiResponse>(`${apiUrl}/verify`, {
        ruleDescription,
        ip,
        email: ruleDescription,
        verificationCode,
        typeGroup,
        typeService,
      });
      setMessage('IP liberado com sucesso!');
      setAlertType('success');
    } catch (error: any) {
      setMessage('Erro ao liberar IP: ' + (error.response?.data.message || error.message));
      setAlertType('error');
    }
  };

  const handleGetMyIp = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      setIp(response.data.ip);
    } catch (error) {
      setMessage('Erro ao obter o IP: ' + (error as any).message);
      setAlertType('error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Liberação de IP
        </Typography>
        <form onSubmit={handleSendCode}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={ruleDescription}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRuleDescription(e.target.value)}
            required
          />
          <Button variant="outlined" color="secondary" type="submit" fullWidth sx={{ mt: 1 }}>
            Enviar Código de Verificação
          </Button>
        </form>
        <TextField
            label="Código de Verificação"
            fullWidth
            margin="normal"
            value={verificationCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
            required
          />
        <form onSubmit={handleSubmit}>
          <TextField
            label="IP"
            fullWidth
            margin="normal"
            value={ip}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setIp(e.target.value)}
            required
          />
          <Button variant="outlined" color="secondary" onClick={handleGetMyIp} fullWidth sx={{ mt: 1 }}>
            Obter meu IP
          </Button>
          <FormControl fullWidth margin="normal">
            <InputLabel>Ambiente</InputLabel>
            <Select
              value={typeGroup}
              onChange={(e: SelectChangeEvent<string>) => setTypeGroup(e.target.value as string)}
              required
            >
              <MenuItem value="prod">Prod</MenuItem>
              <MenuItem value="hml">HML</MenuItem>
              <MenuItem value="dev">Dev</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Servico</InputLabel>
            <Select
              value={typeService}
              onChange={(e: SelectChangeEvent<string>) => setTypeService(e.target.value as string)}
              required
            >
              <MenuItem value="mysql">MySQL</MenuItem>
              <MenuItem value="postgres">Postgres</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
            Liberar IP
          </Button>
        </form>
        {message && (
          <Alert severity={alertType} sx={{ mt: 3 }}>
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default App;
