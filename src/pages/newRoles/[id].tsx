import React from "react";
import Head from "next/head";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import MyInput from "../../components/input";
import styles from "./styles.module.css";
import { authService } from "@/services/auth.service";
import { rolesService } from "@/services/roles.service";
import { Roles } from "@/model/roles";

export default function RolePage() {
  const router = useRouter();
  const params = useParams();

  const [title, setTitle] = React.useState("Novo Papel");

  const [id, setId] = React.useState(0);
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    const user = authService.getLoggedUser();
    if (!user) router.replace("/login");

    if (params && params.id) {
      if (Number(params.id) > 0) {
        setTitle("Edição de Role");
        setId(Number(params.id));
      }
    }
  }, [params]);

  React.useEffect(() => {
    if (id > 0) {
      rolesService
        .get(id)
        .then((role) => {
          setName(role.name);
          setDescription(role.description);
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

  async function save() {
    if (!name || name.trim() === "") {
      alert("Nome é obrigatório");
      return;
    }

    if (!description || description.trim() === "") {
      alert("Descrição é obrigatória");
      return;
    }

    try {
      // editar um papel
      if (id > 0) {
        let body = { name, description } as Roles;
        console.log(id, body);
        await rolesService.update(id.toString(), body);
        router.replace("/roles");
      } else {
        let body = { name, description } as Roles;
        console.log(body);
        await rolesService.create(body);
        router.replace("/roles");
      }
    } catch (error: any) {
      console.log("erro");
    }
  }

  return (
    <div className={styles.loginPage}>
      <Head>
        {" "}
        <title>Cadastro de Papel</title>{" "}
      </Head>

      <main className={styles.main}>
        <h2>{title}</h2>

        <div className={styles.inputs}>
          <MyInput
            readOnly={id > 0}
            label="Nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <MyInput
            label="Descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <button className={styles.saveButton} onClick={save}>
          Salvar
        </button>
      </main>
    </div>
  );
}
