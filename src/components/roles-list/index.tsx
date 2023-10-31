import { User } from "@/model/user";

import styles from "./styles.module.css";
import { Roles } from "@/model/roles";
import { Pencil, Trash } from "@phosphor-icons/react";

type Props = {
  roles: Roles[];
  edit?: (id: number) => void;
  remove?: (id: number) => void;
};

export default function RoleList({ roles, edit, remove }: Props) {
  return (
    <div>
      {roles?.map((role) => (
        <div key={role.id} className={styles.lineItem}>
          <span className={styles.nameLabel}>{role.name}</span>
          <span className={styles.usernameLabel}>{role.description}</span>
          <div>
            {edit && (
              <button className={styles.buttons} onClick={() => edit(role.id!)}>
                <Pencil size={32} color="#00B37E" />
              </button>
            )}
            {remove && (
              <button
                className={styles.buttons}
                onClick={() => remove(role.id!)}
              >
                <Trash size={32} color="#F03847" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
