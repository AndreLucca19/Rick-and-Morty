"use client";

import { useEffect, useState, useRef } from "react";
import CharacterCard from "../../components/CharacterCard";
import axios from "axios";
import styles from "./Home.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";

export default function Home() {
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const cacheRef = useRef(new Map());
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCharacters = async (name = "", pageNumber = 1) => {
        setLoading(true);
        const cache = cacheRef.current;
        const cacheKey = `${name}_${pageNumber}`;
        const nextPageNumber = pageNumber + 1;
        const nextCacheKey = `${name}_${nextPageNumber}`;

        const cleanCacheIfNeeded = () => {
            while (cache.size >= 5) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
        };

        let total = totalPages;

        if (cache.has(cacheKey)) {
            const cachedData = cache.get(cacheKey);
            setCharacters(cachedData.results);
            setTotalPages(cachedData.totalPages);
            total = cachedData.totalPages;
            setNotFound(false);
            setLoading(false);
        } else {
            try {
                const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);
                cleanCacheIfNeeded();
                cache.set(cacheKey, {
                    results: data.results,
                    totalPages: data.info.pages,
                });
                setCharacters(data.results);
                setTotalPages(data.info.pages);
                total = data.info.pages;
                setNotFound(false);
            } catch {
                setCharacters([]);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }

        if (nextPageNumber <= total && !cache.has(nextCacheKey)) {
            try {
                const res = await axios.get(`https://rickandmortyapi.com/api/character/?page=${nextPageNumber}&name=${name}`);
                cleanCacheIfNeeded();
                cache.set(nextCacheKey, {
                    results: res.data.results,
                    totalPages: res.data.info.pages,
                });
            } catch { }
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    const handleSearch = () => {
        setPage(1);
        fetchCharacters(search, 1);
    };

    const handleReset = () => {
        setSearch("");
        setPage(1);
        fetchCharacters("", 1);
        toast.success("Filtro foi resetado com sucesso!", { position: "top-left" });
    };

    const handleCardClick = (char) => {
        toast.info(`Você clicou em ${char.name} que está ${char.status}`);
    };

    useEffect(() => {
        fetchCharacters(search, page);
    }, [page]);

    return (
        <div className={styles.container}>
            <ToastContainer position="top-right" autoClose={7500} theme="light" />
            <h1 className={styles.title}>Personagens Rick and Morty</h1>
            <div className={styles.controls}>
                <div className={styles.barraPesquisa}>
                    <button onClick={handleSearch} className={styles.searchButton}>
                        Buscar
                    </button>
                    <input
                        type="text"
                        placeholder="Buscar por nome"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.input}
                    />
                    <button onClick={handleReset} className={styles.resetButton}>
                        Resetar
                    </button>
                </div>
            </div>
            <div className={styles.navControls}>
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1 || notFound} className={styles.buttonNav}>
                    Página Anterior
                </button>
                <span className={styles.pageIndicator}>
                    Página {page} de {totalPages}
                </span>
                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages || notFound} className={styles.buttonNav}>
                    Próxima Página
                </button>
            </div>
            {notFound && <h1 className={styles.notFound}>Nenhum personagem encontrado 😢</h1>}
            {loading ? (
                <div className={`${styles.loaderWrapper} ${loading ? "" : styles.hidden}`}>
                    <Loader />
                </div>
            ) : (
                <div className={styles.grid}>
                    {characters.map((char) => (
                        <CharacterCard key={char.id} character={char} onClick={() => handleCardClick(char)} />
                    ))}
                </div>
            )}
        </div>
    );
}