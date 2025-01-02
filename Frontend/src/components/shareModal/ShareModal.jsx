import React, { useState } from 'react';
import styles from './ShareModal.module.css'; 

function ShareModal({ onClose, handleShare }) {

    const [email,setEmail] = useState("")
    const [permission, setPermission] = useState('edit');
 

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <button className={styles.closeButton} onClick={onClose}>✕</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.text}>
                        <h4>Invite by Email</h4>
                        <select 
                            value={permission}
                            onChange={(e) => setPermission(e.target.value)}
                            className={styles.permissionDropdown}
                        >
                            <option value="edit">Edit</option>
                            <option value="view">View</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            placeholder="Enter email id"
                            className={styles.inputField}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        
                    </div>
                    <button 
                        className={styles.sendInviteButton}
                        onClick={()=>{
                            handleShare(email, permission)
                            onClose()
                        }}    
                    >Send Invite</button>

                    <h4>Invite by Link</h4>
                    <div className={styles.linkSection}>
                        <button
                            className={styles.copyLinkButton}
                            onClick={() => navigator.clipboard.writeText("https://example.com/share-link")}
                        >
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareModal;