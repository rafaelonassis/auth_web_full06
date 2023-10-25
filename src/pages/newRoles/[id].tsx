import React from 'react'
import Head from "next/head"

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import MyInput from '../../components/input'
import styles from './styles.module.css'
import { authService } from '@/services/auth.service'
import { rolesService } from '@/services/roles.service'
import { Roles } from '@/model/roles'

export default function RolePage() {

    const router = useRouter()
    const params = useParams()

    const [title, setTitle] = React.useState('Nova Role')

    const [id, setId] = React.useState(0)
    const [name, setName] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [description, setDescription] = React.useState('')

    React.useEffect(() => {
        const user = authService.getLoggedUser()
        if (!user) router.replace('/login')

        if (params && params.id) {
            if (Number(params.id) > 0) {
                setTitle('Edição de Role')
                setId(Number(params.id))
            }
        }
    }, [params])

    React.useEffect(() => {
        if (id > 0) {
            rolesService.get(id).then(role => {
                setName(role.name)
                setDescription(role.description)
            }).catch(treat)
        }
    }, [id])

    function treat(error: any) {
        if (authService.isUnauthorized(error)) {
            router.replace('/login')
        } else {
            alert(`${username}: ${error.message}`)
        }
    }

    async function save() {
        if (!name || name.trim() === '') {
            alert('Nome é obrigatório')
            return
        }

        if (!description || description.trim() === '') {
            alert('Descrição é obrigatória')
            return
        }


        try {
            if (id > 0) { // editar um papel
                let body = { name, description } as Roles
                
                await rolesService.update(id, body)
                router.back()
            } 
        } catch (error: any) {
            treat(error)
        }
    }

    return (
        <div className={styles.loginPage}>
            <Head> <title>Cadastro de Usuário</title> </Head>

            <main className={styles.main}>
                <h2>{title}</h2>

                <div className={styles.inputs}>
                    <MyInput
                        label='Nome'
                        value={name}
                        onChange={event => setName(event.target.value)}
                    />
                    <MyInput
                        label='Descrição'
                        value={description}
                        readOnly={id > 0}
                        onChange={event => setDescription(event.target.value)}
                    />
                </div>

                <button className={styles.button} onClick={save}>Salvar</button>
            </main>
        </div>
    )
}