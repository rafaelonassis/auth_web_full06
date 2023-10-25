import React from 'react'
import Head from 'next/head'

import styles from './styles.module.css'
import { useRouter } from 'next/navigation'
import { User } from '@/model/user'
import { userService } from '@/services/user.service'
import UserList from '@/components/user-list'
import { authService } from '@/services/auth.service'

export default function HomePage() {

    const router = useRouter()

    const [ users, setUsers ] = React.useState<User[]>([])

    React.useEffect(fetchUsers, [])

    function goToUser() {
        router.push('/user/0')
    }

    function goToRoles() {
        router.replace('/roles')
    }

    function treat(error: any) {
        if (authService.isUnauthorized(error)) {
            router.replace('login')
        } else {
            alert(error.message)
        }
    }

    function fetchUsers() {
        userService.getList()
            .then(list => setUsers(list))
            .catch(treat)
    }

    function edit(id: number) {
        router.push(`/user/${id}`)
    }

    function remove(id: number) {
        userService.remove(id)
            .then(removed => fetchUsers())
            .catch(treat)
    }

    function logoff(){
        authService.logOff();
        router.replace('/login');
    }

    return (
        <>
            <Head>
                <title>Home Page</title>
            </Head>
            <main>
                <div className={styles.homeHeader}>
                    <div>
                        <button onClick={logoff} >Sair</button>
                    </div>

                    <h3>Listagem de Usuários</h3>

                    <div>
                        <button onClick={goToRoles}>Papéis</button>
                    </div>
                    <div>
                        <button onClick={goToUser}>Add</button>
                    </div>
                </div>

                <div className={styles.homeMain}>
                    <UserList users={users} edit={edit} remove={remove} />
                </div>

            </main>
        </>
    )
}
