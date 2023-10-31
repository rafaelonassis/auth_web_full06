import React from "react";
import Head from "next/head";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { Roles } from "@/model/roles";
import { authService } from "@/services/auth.service";
import RoleList from "@/components/roles-list";
import { rolesService } from "@/services/roles.service";
import { PlusCircle, SignOut, Users } from "@phosphor-icons/react";

const rolesPage = () => {
  const router = useRouter();

  const [roles, setRoles] = React.useState<Roles[]>([]);

  function goToUser() {
    router.replace("/home");
  }

  function edit(id: number) {
    router.push(`/newRoles/${id}`);
  }

  function remove(id: number) {
    rolesService
      .remove(id)
      .then((removed) => fetchRoles())
      .catch(treat);
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

  function treat(error: any) {
    if (authService.isUnauthorized(error)) {
      router.replace("login");
    } else {
      alert(error.message);
    }
  }

  function goToRoles() {
    router.replace("/newRoles/0");
  }

  function logoff() {
    authService.logOff();
    router.replace("/login");
  }

  React.useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <header className={styles.title}>
        <h3>Listagem de Roles</h3>
      </header>
      <main>
        <div className={styles.homeHeader}>
          <button className={styles.buttons} onClick={logoff}>
            <SignOut size={32} color="#F03847" />
            <span className={styles.textButton}>Sair</span>
          </button>

          <button className={styles.buttons} onClick={goToUser}>
            <Users size={32} color="#00B37E" />
            <span className={styles.textButton}>Usuários</span>
          </button>
          <button className={styles.buttons} onClick={goToRoles}>
            <PlusCircle size={32} color="#00B37E" />
            <span className={styles.textButton}>Adicionar Papéis</span>
          </button>
        </div>

        <div className={styles.homeMain}>
          <RoleList roles={roles} edit={edit} remove={remove} />
        </div>
      </main>
    </>
  );
};

export default rolesPage;
