import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../pages/dashboard/Dashboard.module.css';

function FormCard({ forms, onDelete }) {
    return (
        <>
            {forms.map((form, key) => (
                <div className={styles.formCard} key={key}>
                    <img className={styles.delete} src="/icons/bin.png" onClick={() => onDelete(form._id, 'form')} width={20} alt="trash icon" />
                    <Link to={`/form/edit/${form._id}`} className={`${styles.card} ${styles.created}`}>
                        <span>{form.name}</span>
                    </Link>
                </div>
            ))}
        </>
    )
}

export default FormCard