import { User } from "@/model/user"

import styles from './styles.module.css'
import { Roles } from "@/model/roles"

type Props = {
    roles: Roles[],
    edit?: (id: number) => void,
    remove?: (id: number) => void
}

export default function RoleList({ roles, edit, remove }: Props) {
    return (
        <div>
            {
                roles?.map(role => (
                    <div key={role.id} className={styles.lineItem}>
                        <span className={styles.nameLabel}>{role.name}</span>
                        <span className={styles.usernameLabel}>{role.description}</span>
                        <div>
                            { edit && (
                                <button
                                    className={styles.editButton}
                                    onClick={() => edit(role.id!)}
                                >
                                    Alterar
                                </button>
                            ) }
                            { remove && (
                                <button
                                    className={styles.delButton}
                                    onClick={() => remove(role.id!)}
                                >
                                    Remover
                                </button>
                            ) }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}