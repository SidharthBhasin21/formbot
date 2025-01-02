import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import styles from "../dashboard/Dashboard.module.css";
import FormCard from "../../components/dashboard/FormCard";
import DeleteModal from "../../components/dashboard/DeleteModal";
import CreateFormModal from "../../components/createFormModal";
import { createFormInDashboard, getAllforms } from "../../apis/dashboard";
import { createFormInFolder, deleteForm, getAllformsInFolder } from "../../apis/form";


function Folder() {
    const token = useAuth();

    const navigate = useNavigate();

    

    const { folderId } = useParams();
    const [allForm, setAllForm] = useState([]);
    const [formId, setFormId] = useState(null);
    const [formName, setFormName] = useState(null);
    const [formNameError, setFormNameError] = useState(null);

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isCreateFormModalOpen, setIsCreateFormModalOpen] = useState(false);
    

    const openDeleteModal = (id) => {
        setFormId(id);
        setDeleteModalOpen(true);
    };
    const openCreateFormModal = () => {
        setFormName("");
        setIsCreateFormModalOpen(true);
        setDeleteModalOpen(false);
    };

    const fetchAllFormByFolder = async () => {
        const data = await getAllformsInFolder(folderId, token);
        if (data) setAllForm(data);
    };

    const handleDeleteForm = async () => {
        const data = await deleteForm(formId);
        if (data) {
            setDeleteModalOpen(false);
            fetchAllFormByFolder();
        }
    };
    const handleCreateForm = async() => {
    
        if (formName.trim().length === 0) {
            setFormNameError("Enter form name");
            return;
        }
        const response = await createFormInFolder(folderId, formName);
    
        if (response){
            setIsCreateFormModalOpen(false);
            fetchAllFormByFolder();
        }
    }

    useEffect(() => {
        if (token) fetchAllFormByFolder();
    }, [token]);

    return (
        <div className={styles.section}>
            <p>
                <img
                    src="/icons/arrow-back.png"
                    className="goback"
                    alt="Go back"
                    onClick={() => navigate(-1)}
                />
            </p>
            <div className={styles.forms}>
                <button onClick={openCreateFormModal} className={styles.card}>
                    <img src="/icons/plus.png" alt="plus" />
                    <span>Create a form</span>
                </button>
                <FormCard 
                    forms={allForm} 
                    onDelete={openDeleteModal} />
                {isCreateFormModalOpen && (
                    <CreateFormModal
                        formName={formName}
                        formNameError={formNameError}
                        onNameChange={(e) => setFormName(e.target.value)}
                        onCreate={handleCreateForm}
                        onClose={() => setIsCreateFormModalOpen(false)}
                    />
                )}
                {isDeleteModalOpen && (
                    <DeleteModal
                        entityType="form"
                        onDelete={handleDeleteForm}
                        onClose={() => setDeleteModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default Folder;
