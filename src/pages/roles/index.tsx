import React from "react";
import Head from "next/head";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { Roles } from "@/model/roles";
import { authService } from "@/services/auth.service";
import RoleList from "@/components/roles-list";
import { rolesService } from "@/services/roles.service";

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
      <main>
        <div className={styles.homeHeader}>
          <div>
            <button onClick={logoff}>Sair</button>
          </div>

          <h3>Listagem de Roles</h3>

          <div>
            <button onClick={goToUser}>Usuarios</button>
          </div>
          <div>
            <button onClick={goToRoles}>Add Roles</button>
          </div>
        </div>

        <div className={styles.homeMain}>
          <RoleList roles={roles} edit={edit} remove={remove} />
        </div>
      </main>
    </>
  );
};

export default rolesPage;
