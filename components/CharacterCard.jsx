import styles from "../styles/CharacterCarde.module.css";

export default function CharacterCard({ character }) {
    return (
        <div className={styles.card}>
            <img 
            src={character.image}
            alt={character.name}
            className={styles.avatar}
            />
            <h3 className={styles.title}>{character.name}</h3>
            <p>essa é a pagina inicial</p>
        </div>
    );
}