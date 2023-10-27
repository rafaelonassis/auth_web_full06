import React, { useEffect } from "react";
import Head from "next/head";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import MyInput from "../../components/input";
import styles from "./styles.module.css";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { User } from "@/model/user";
import { rolesService } from "@/services/roles.service";
import { Roles } from "@/model/roles";

export default function UserPage() {
  const router = useRouter();
  const params = useParams();

  const [title, setTitle] = React.useState("Novo Usuário");

  const [id, setId] = React.useState(0);
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passConfirm, setPassConfirm] = React.useState("");
  const [roles, setRoles] = React.useState<Roles[]>([]);

  React.useEffect(() => {
    const user = authService.getLoggedUser();
    if (!user) router.replace("/login");

    if (params && params.id) {
      if (Number(params.id) > 0) {
        setTitle("Edição de Usuário");
        setId(Number(params.id));
      }
    }
  }, [params]);

  React.useEffect(() => {
    if (id > 0) {
      userService
        .get(id)
        .then((user) => {
          setName(user.name);
          setUsername(user.username);
        })
        .catch(treat);
    }
  }, [id]);

  function treat(error: any) {
    if (authService.isUnauthorized(error)) {
      router.replace("/login");
    } else {
      alert(`${username}: ${error.message}`);
    }
  }

  async function fetchRoles() {
    await rolesService
      .getList()
      .then((Rolelist) => {
        setRoles(Rolelist);
        console.log(Rolelist);
      })
      .catch(treat);
  }

  React.useEffect(() => {
    fetchRoles();
  }, []);

  async function save() {
    if (!name || name.trim() === "") {
      alert("Nome é obrigatório");
      return;
    }

    if (id === 0 || password.trim() !== "") {
      if (!password || password.trim() === "") {
        alert("Senha é obrigatória");
        return;
      }
      if (password !== passConfirm) {
        alert("A Senha não confere");
        return;
      }
    }

    try {
      if (id > 0) {
        // editar um usuário
        let body = { name, username } as User;

        if (password && password.trim() !== "") {
          body = { ...body, password };
        }
        await userService.update(id, body);
        router.back();
      } else {
        // Criar um novo
        if (!username || username.trim() === "") {
          alert("Login é obrigatório");
          return;
        }

        let roleList: any = [];

        Array.from(
          document.querySelectorAll('input[type="checkbox"]:checked')
        ).forEach((input) => {
          roleList.push(input.previousElementSibling?.textContent);
        });

        await userService.create({
          name: name,
          username: username,
          password: password,
          roles: roleList,
        });
        router.back();
      }
    } catch (error: any) {
      treat(error);
    }
  }

  return (
    <div className={styles.loginPage}>
      <Head>
        {" "}
        <title>Cadastro de Usuário</title>{" "}
      </Head>

      <main className={styles.main}>
        <h2>{title}</h2>

        <div className={styles.inputs}>
          <MyInput
            label="Nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <MyInput
            label="Login"
            value={username}
            readOnly={id > 0}
            onChange={(event) => setUsername(event.target.value)}
          />
          <MyInput
            label="Senha"
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <MyInput
            label="Confirmar Senha"
            type="password"
            onChange={(event) => setPassConfirm(event.target.value)}
          />
          {roles.map((role) => (
            <MyInput label={role.name} type="checkbox" key={role.id} />
          ))}
        </div>

        <button className={styles.button} onClick={save}>
          Salvar
        </button>
      </main>
    </div>
  );
}
