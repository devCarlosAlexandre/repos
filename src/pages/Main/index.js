import React, { useState, useCallback, useEffect } from "react";
import { Container, Form, SubmitButton, List, DeleteButton } from './styles'
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import api from '../../services/api'

export default function Main() {
    const [newRepo, setNewRepo] = useState('')
    const [loading, setLoading] = useState(false)
    const [repositorios, setRepositorios] = useState([])
    const [alert, setAlert] = useState(null)

    useEffect(() => {
        const repoStorage = localStorage.getItem("repos");
        if (repoStorage) {
            setRepositorios(JSON.parse(repoStorage));
        }
    }, [])

    // useEffect(() => {
    //     localStorage.setItem("repos", JSON.stringify(repositorios));
    // }, [repositorios])

    function handleInputChange(e) {
        setNewRepo(e.target.value)
        setAlert(null);
    }

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        async function submit() {
            setLoading(true)
            setAlert(null)
            try {
                if (newRepo === '') {
                    throw new Error('Você precisa indicar um repositório')
                }
                const response = await api.get(`repos/${newRepo}`)

                const hasRepo = repositorios.find(repo => repo.name === newRepo);
                if (hasRepo) {
                    throw new Error('Repositorio duplicado')
                }

                const data = {
                    name: response.data.full_name,
                }

                setRepositorios([...repositorios, data])
                localStorage.setItem("repos", JSON.stringify([...repositorios, data]));
                setNewRepo('')
            } catch (error) {
                setAlert(true)
                console.log(error)
            } finally {
                setLoading(false)
            }

        }
        submit()
    }, [newRepo, repositorios])

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo)
        setRepositorios(find)
        localStorage.setItem("repos", JSON.stringify(find))
    }, [repositorios]);

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositórios
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
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
            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    );
}