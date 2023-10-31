import React from "react";
import Head from "next/head";

import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { User } from "@/model/user";
import { userService } from "@/services/user.service";
import UserList from "@/components/user-list";
import { authService } from "@/services/auth.service";
import { IdentificationCard, PlusCircle, SignOut } from "@phosphor-icons/react";

export default function HomePage() {
  const router = useRouter();

  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(fetchUsers, []);

  function goToUser() {
    router.push("/user/0");
  }

  function goToRoles() {
    router.replace("/roles");
  }

  function treat(error: any) {
    if (authService.isUnauthorized(error)) {
      router.replace("login");
    } else {
      alert(error.message);
    }
  }

  function fetchUsers() {
    userService
      .getList()
      .then((list) => setUsers(list))
      .catch(treat);
  }

  function edit(id: number) {
    router.push(`/user/${id}`);
  }

  function remove(id: number) {
    userService
      .remove(id)
      .then((removed) => fetchUsers())
      .catch(treat);
  }

  function logoff() {
    authService.logOff();
    router.replace("/login");
  }

  return (
    <>
      <Head>
        <title>Usuários</title>
      </Head>
      <header className={styles.title}>
        <h3>Listagem de Usuários</h3>
      </header>
      <main>
        <div className={styles.homeHeader}>
          <button className={styles.buttons} onClick={logoff}>
            <SignOut size={32} color="#F03847" />
            <span className={styles.textButton}>Sair</span>
          </button>

          <button className={styles.buttons} onClick={goToRoles}>
            <IdentificationCard size={32} color="#00B37E" />
            <span className={styles.textButton}>Papéis</span>
          </button>
          <button className={styles.buttons} onClick={goToUser}>
            <PlusCircle size={32} color="#00B37E" />
            <span className={styles.textButton}>Adicionar Usuário</span>
          </button>
        </div>

        <div className={styles.homeMain}>
          <UserList users={users} edit={edit} remove={remove} />
        </div>
      </main>
    </>
  );
}
