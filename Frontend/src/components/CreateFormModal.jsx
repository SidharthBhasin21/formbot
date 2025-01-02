import React from 'react'
import styles from "../pages/dashboard/Dashboard.module.css";


const CreateFormModal = ({formName, formNameError, onNameChange, onCreate, onClose  }) => {
  return (
    <div className={styles.createFolderModal}>
                <span>Create from name</span>
                <form 
                    onSubmit={(e) =>{
                        e.preventDefault();
                        onCreate()}}
                    >
                    <div className={styles.inputs}>
                        <input 
                            type="text" 
                            className={formNameError ? 'error' : ''} value={formName} onChange={onNameChange} 
                            placeholder="Enter form name" 
                        />
                        <label className="error">{formNameError}</label>
                    </div>
                    <div className={styles.action}>
                        <span className={styles.confirm} onClick={onCreate}>Done</span>
                        <span></span>
                        <span className={styles.cancel} onClick={onClose}>Cancel</span>
                    </div>
                </form>
            </div>
  )
}

export default CreateFormModal