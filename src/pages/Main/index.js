import React, { useState, useCallback } from "react";
import { Container, Form, SubmitButton } from './styles'
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa'

import api from '../../services/api'

export default function Main() {
    const [newRepo, setNewRepo] = useState('')
    const [loading, setLoading] = useState(false)
    const [repositorios, setRepositorios] = useState([])

    function handleInputChange(e) {
        setNewRepo(e.target.value)
    }

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        async function submit() {
            setLoading(true)
            try {
                const response = await api.get(`repos/${newRepo}`)

                const data = {
                    name: response.data.full_name,
                }

                setRepositorios([...repositorios, data])
                setNewRepo('')
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }

        }
        submit()
    }, [newRepo, repositorios])

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositórios
            </h1>

            <Form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Adicionar Repositorios"
                    value={newRepo}
                    onChange={handleInputChange}
                />
                <SubmitButton loading={loading ? 1 : 0}>
                    {
                        loading ? (
                            <FaSpinner
                                color="#fff"
                                size={14}
                            />
                        ) : <FaPlus color="#fff" size={14} />
                    }

                </SubmitButton>
            </Form>
        </Container>
    );
}