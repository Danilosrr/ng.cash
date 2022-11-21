import {
  Box,
  Button,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import PasswordInput from "../components/PasswordInput";
import useAlert from "../hooks/useAlert";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import logo from "../assets/images/logo-ngcash-branco.svg";

const styles = {
  container: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  input: { marginBottom: "16px", padding:'0 10px', backgroundColor:'#ffffff', backgroundClip: 'content-box'},
  actionsContainer: {
    display: "flex",
    padding:'0 10px',
    justifyContent: "space-between",
    alignItems: "center",
  },
};

interface FormData {
  username: string;
  password: string;
}

function SignIn() {
  const { signIn } = useAuth();
  const { setMessage } = useAlert();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!formData?.username || !formData?.password) {
      setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
      return;
    }

    const { username, password } = formData;

    try {
      const {
        data: { token },
      } = await api.signIn({ username, password });
      console.log(token);
      signIn(token);
      navigate("/app/Home");
    } catch (error: Error | AxiosError | any) {
      if (error.response) {
        setMessage({
          type: "error",
          text: error.response.data,
        });
        return;
      }

      setMessage({
        type: "error",
        text: "Erro, tente novamente em alguns segundos!",
      });
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <img src={logo} alt='ng.cash logo' style={{maxWidth:'150px'}}/>
      <Box sx={styles.container}>
        <Box sx={{ height: "50px"}}/>
        <TextField
          name="username"
          sx={styles.input}
          label="usuario"
          type="text"
          variant="filled"
          onChange={handleInputChange}
          value={formData.username}
        />
        <PasswordInput
          name="password"
          sx={styles.input}
          label="Senha"
          onChange={handleInputChange}
          value={formData.password}
        />
        <Box sx={styles.actionsContainer}>
          <Link href="/">
            <Typography color={'#fff'}>Não possuo cadastro</Typography>
          </Link>
          <Button variant="contained" type="submit" sx={{backgroundColor: '#7431F4'}}>
            Entrar
          </Button>
        </Box>
      </Box>
    </Form>
  );
}

export default SignIn;
