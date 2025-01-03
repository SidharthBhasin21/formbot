import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createFormApi, fetchFormById, updateForm } from "../../apis/form";
import styles from './Navbar.module.css';
import useAuth from '../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../../utils/redux/slices/themeSlice';

function Navbar({ setWorkspaceId, updateFormSequence }) {
    const token = useAuth();
    const navigate = useNavigate();
    const {formId: id} = useParams();
    const [searchParams] = useSearchParams();
    const dashboardId = useSelector(state => state.dashboard.dashboardId);
    
    const dispatch = useDispatch()
    const darkMode = useSelector((state) => state.darkMode.darkMode);
    

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    })
    const [folderId, setFolderId] = useState(searchParams.get('fid'));
    const [formId, setFormId] = useState(id);
    const [formName, setFormName] = useState('');
    const [formSequence, setFormSequence] = useState('');
    const [formNameError, setFormNameError] = useState('');

    const createForm = async () => {
        setFormNameError('');
        if (formName.trim().length === 0) { setFormNameError('Enter form name'); return; }

        const formId = await createFormApi(folderId, formName, token);
        if (formId) {
            setFormId(formId); setWorkspaceId(formId);
            navigate(`/workspace?wid=${formId}`);
        }
    };
    const handleThemeToggle = () => {
        dispatch(toggleDarkMode())
        setIsDarkMode(!isDarkMode)  
    };

    const handleFetchFormById = async () => {
        const data = await fetchFormById(formId);
        if (data) {
            setFormName(data.name);
            setFormSequence(data.sequence);
        }
    };

    const handleUpdateForm = async () => {
        if (formName.trim().length === 0) return;

        const data = await updateForm(formId, { formName });
        if (data) setFormName(formName);
    };

    const handleFormSave = async () => {
        if (formId) {
            if (updateFormSequence) {
                await updateFormSequence();
                handleFetchFormById();
            }
            await handleUpdateForm();
        } else {
            await createForm();
        }
    };

    const copyFormLink = async () => {
        const link = `${window.location.origin}/share/${formId}`;
        try {
            await navigator.clipboard.writeText(link);
            toast.success("Form link copied successfully.");
        } catch (error) {
            toast.error("Failed to copy form link.");
        }
    };

    useEffect(() => {
        if (token) {
            if (formId) handleFetchFormById();
        }
    }, [token]);
    useEffect(() => {
        // Apply the theme on mount
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]); 

    return (
        <div className={styles.navbar}>
            <div className={styles.formTitle}>
                <input type="text" className={formNameError && 'error'} value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Enter Form Name" />
            </div>
            <div className={styles.formNav}>
                <NavLink to={formId ? `/workspace?wid=${formId}` : window.location} className={({ isActive }) => isActive ? styles.active : ''}>Flow</NavLink>
                <NavLink to={formId ? `/submissions?fid=${formId}` : window.location} className={({ isActive }) => isActive && formId ? styles.active : ''}>Response</NavLink>
            </div>
            <div className={styles.formAction}>
                <div className={styles.toggleSwitch}>
                            <input 
                                className={styles.toggleInput} 
                                id="toggle" 
                                type="checkbox"
                                checked={isDarkMode}
                                onChange={handleThemeToggle}
                            />
                            <label class={styles.toggleLabel} for="toggle"></label>
                </div>
                <button disabled={formSequence?.length == 0} onClick={copyFormLink}>Share</button>
                <button onClick={handleFormSave}>Save</button>
                <NavLink to={`/dashboard/${dashboardId}`}><img src="/icons/close.png" alt="close icon" /></NavLink>
            </div>
        </div>
    )
}

export default Navbar