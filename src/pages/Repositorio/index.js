import React, { useEffect, useState } from "react";
import api from '../../services/api';
import { Container, Owner, Loading, BackButton, IssuesList, PageActions } from "./styles";
import { FaArrowLeft } from 'react-icons/fa'


export default function Repositorio({ match }) {
    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setloading] = useState(true);
    const [page, setPage] = useState(1);

    function handlePage(action) {
        setPage(action === 'back' ? page - 1 : page + 1)
    }

    useEffect(() => {
        async function loadIssue() {
            const nomeRepo = decodeURIComponent(match.params.repositorio);

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: 'open',
                    page,
                    per_page: 5,
                },
            });
            setIssues(response.data)
        }

        loadIssue();

    }, [page]);

    useEffect(() => {
        async function load() {
            const nomeRepo = decodeURIComponent(match.params.repositorio)
            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: 'open',
                        per_page: 5
                    }
                })
            ]);

            setRepositorio(repositorioData.data);
            setIssues(issuesData.data);
            setloading(false);
        }

        load();

    }, []);

    if (loading) {
        return (
            <Loading>
                Carregando...
            </Loading>
        )
    }

    return (
        <Container>
            <BackButton to="/">
                <FaArrowLeft size={30} color="#000" />
            </BackButton>
            <Owner>
                <img
                    src={repositorio.owner.avatar_url}
                    alt={repositorio.owner.login}
                />
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </Owner>

            <IssuesList>
                {issues.map((issue) => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />

                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>

                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                )
                )}
            </IssuesList>

            <PageActions>
                <button
                    type="button"
                    onClick={() => handlePage('back')}
                    disabled={page < 2}
                >
                    Voltar
                </button>

                <button type="button" onClick={() => handlePage('next')}>
                    Próxima
                </button>
            </PageActions>

        </Container>
    );
}