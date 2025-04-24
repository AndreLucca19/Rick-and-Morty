"use client";

import { useEffect, useState } from "react";
import CharacterCard from "../../components/CharacterCard";
import axios from "axios";
import styles from "./Home.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [search, setSearch] = useState("");
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCharacters = async (name, pageNumber) => {
        setNotFound(false);
        try {
            const { data } = await axios.get(
                `https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`
            );
            setCharacters(data.results);
            setTotalPages(data.info.pages);
            setNotFound(false);
        } catch {
            setCharacters([]);
            setNotFound(true);
        }
    };

    useEffect(() => {
        fetchCharacters(search.trim(), page);
    }, [page]);


    const handleSearch = () => {
        const name = search.trim();
        setPage(1);
        fetchCharacters(name, 1);
    };
    
    const handleReset = () => {
        setSearch("");
        setPage(1);
        fetchCharacters("", 1);
        toast.sucess("Filtro foi resetado com sucesso!", {position: "top-right"});
    }

    const handleCardClick = (name) => {
        toast.info(`Você clicou em ${name}`);
    };

    console.log(characters);

    return (
        <div className={styles.container}>
            <ToastContainer position="top-right" autoClose={7500} theme="light" />
            <h1 className={styles.title}>Personagens Rick and Morty</h1>
            <div className={styles.barraPesquisa}>
                <button
                    onClick={handleSearch}
                    className={styles.searchButton}
                >
                    Buscar
                </button>
                <input
                    type="text"
                    placeholder="Buscar por nome"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.input}
                />
                <button
                    onClick={handleReset} 
                    className={styles.resetButton}
                >
                    Resetar
                </button>

                <div className={styles.navControls}>
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className={styles.buttonNav}
                    >
                        pagina anterior
                    </button>

                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className={styles.buttonNav}
                    >
                        proxima pagina
                    </button>
                </div>
            </div>
            {notFound && (
                <h1 className={styles.notFound}>Nenhum personagem encontrado 😢</h1>
            )}
            <div className={styles.grid}>
                {characters.map((char) => (
                    <CharacterCard
                        key={char.id}
                        character={char}
                        onClick={() => handleCardClick(char.name)} // Chama a função ao clicar no card
                    />
                ))}
            </div>
        </div>
    );
}