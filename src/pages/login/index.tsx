import React from "react";
import Head from "next/head";

import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";
import MyInput from "../../components/input";
import styles from "./styles.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function signIn() {
    const isLogged = await authService.login(login, password);
    if (isLogged) {
      router.replace("home");
    } else {
      alert("Login/senha inválido(a)!");
    }
  }

  return (
    <div className={styles.loginPage}>
      <Head>
        {" "}
        <title>Acesso</title>{" "}
      </Head>

      <main>
        <h2 className={styles.title}>Acesso ao Sistema</h2>
        <div className={styles.loginContainer}>
          <MyInput
            label="Login"
            onChange={(event) => setLogin(event.target.value)}
          />

          <MyInput
            label="Senha"
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button className={styles.loginButton} onClick={signIn}>
          Entrar
        </button>
      </main>
    </div>
  );
}
