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
  passwordConfirmation: string;
}

function SignUp() {
  const { setMessage } = useAlert();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    passwordConfirmation: "",
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (
      !formData?.username ||
      !formData?.password ||
      !formData?.passwordConfirmation
    ) {
      setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
      return;
    }

    const { username, password, passwordConfirmation } = formData;

    if (password !== passwordConfirmation) {
      setMessage({ type: "error", text: "As senhas devem ser iguais!" });
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      setMessage({ type: "error", text: "A senha deve conter no mínimo 8 caracteres, letras maiúsculas, minúsculas e um número!"});
      return;
    }
    
    try {
      await api.signUp({ username, password });
      setMessage({ type: "success", text: "Cadastro efetuado com sucesso!" });
      navigate("/login");
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
          label="username"
          type="username"
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
        <PasswordInput
          name="passwordConfirmation"
          sx={styles.input}
          label="Confirme sua senha"
          onChange={handleInputChange}
          value={formData.passwordConfirmation}
        />
        <Box sx={styles.actionsContainer}>
          <Link href="/Login">
            <Typography color={'#fff'}>Já possuo cadastro</Typography>
          </Link>
          <Button variant="contained" type="submit" sx={{backgroundColor: '#7431F4'}}>
            Cadastrar
          </Button>
        </Box>
      </Box>
    </Form>
  );
}

export default SignUp;
