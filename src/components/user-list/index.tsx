import { User } from "@/model/user";

import styles from "./styles.module.css";
import { Pencil, Trash } from "@phosphor-icons/react";

type Props = {
  users: User[];
  edit?: (id: number) => void;
  remove?: (id: number) => void;
};

export default function UserList({ users, edit, remove }: Props) {
  return (
    <div>
      {users?.map((user) => (
        <div key={user.id} className={styles.lineItem}>
          <span className={styles.nameLabel}>{user.name}</span>
          <span className={styles.usernameLabel}>{user.username}</span>
          <div>
            {edit && (
              <button className={styles.buttons} onClick={() => edit(user.id!)}>
                <Pencil size={32} color="#00B37E" />
              </button>
            )}
            {remove && (
              <button
                className={styles.buttons}
                onClick={() => remove(user.id!)}
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
