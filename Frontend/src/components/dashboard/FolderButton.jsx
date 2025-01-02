import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../pages/dashboard/Dashboard.module.css';


function FolderButton({ folders, onDelete }) {
    const navigate = useNavigate();

    return (
        <>
            {folders.map((folder, key) => (
                <button className={styles.createOpen} key={key}>
                    <span onClick={() => navigate(`/folder/${folder._id}`)}>{folder.name}</span>
                    <img src="/icons/bin.png" onClick={() => onDelete(folder._id)} alt="trash" />
                </button>
            ))}
        </>
    );
}

export default FolderButton