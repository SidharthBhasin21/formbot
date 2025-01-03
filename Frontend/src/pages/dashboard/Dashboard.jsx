import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./Dashboard.module.css";
import useAuth from "../../hooks/useAuth";
import {createFormInDashboard, getAllforms, getDashboard, getUserDashboards, shareDashboard} from "../../apis/dashboard"
import FolderButton from "../../components/dashboard/FolderButton";
import FormCard from "../../components/dashboard/FormCard";
import CreateFolderModal from "../../components/dashboard/createFolder";
import DeleteModal from "../../components/dashboard/DeleteModal";
import {createFolder, deleteFolderApi, getAllfolders} from "../../apis/folders";
import CreateFormModal from "../../components/createFormModal";
import { toast } from "react-toastify";
import { deleteForm } from "../../apis/form";
import ShareModal from "../../components/shareModal/ShareModal";
import { useDispatch, useSelector } from "react-redux";
import { clearDashboardId, setDashboardId } from "../../utils/redux/slices/dashboardSlice";
import { toggleDarkMode } from "../../utils/redux/slices/themeSlice";


const Dashboard = () => {
  const {id} = useParams();
  const token = useAuth();
  const navigate = useNavigate();

  const dispatch = useDispatch()
  const darkMode = useSelector((state) => state.darkMode.darkMode);

  const [userData, setUserData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  }

  );

  const [allFolder, setAllFolder] = useState([]);
  const [allUserDashboards, setAllUserDashboards] = useState([]);
  const [folderId, setFolderId] = useState(null);
  const [folderName, setFolderName] = useState(null);
  const [formName, setFormName] = useState(null);
  const [folderNameError, setFolderNameError] = useState(null);
  const [formNameError, setFormNameError] = useState(null);

  const [allForm, setAllForm] = useState([]);
  const [formId, setFormId] = useState(null);
  const [entityType, setEntityType] = useState(null);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isCreateFormModalOpen, setIsCreateFormModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openCreateModal = () => {
    setFolderName("");
    setFolderNameError("");
    setFormName("");
    setFormNameError("")
    setIsCreateFormModalOpen(false);
    setCreateModalOpen(true);
    setDeleteModalOpen(false);
  };

  const openCreateFormModal = () => {
    setFolderName("");
    setFolderNameError("");
    setFormName("");
    setFormNameError("")
    setIsCreateFormModalOpen(true);
    setCreateModalOpen(false);
    setDeleteModalOpen(false);
  }


  const openDeleteModal = (id, type = "folder") => {
    setEntityType(type);
    setFormId(null);
    setFolderId(null);
    if (type == "form") setFormId(id);
    else setFolderId(id);
    setDeleteModalOpen(true);
    setCreateModalOpen(false);
  };
  const openShareModal = () => {
    setFolderName("");
    setFolderNameError("");
    setFormName("");
    setFormNameError("")
    setIsCreateFormModalOpen(false);
    setCreateModalOpen(false);
    setDeleteModalOpen(false);
    setIsShareModalOpen(true);
  }

  const handleThemeToggle = () => {
    dispatch(toggleDarkMode())
    setIsDarkMode(!isDarkMode)  
  };

  const userDashboard = async () => {
    const data = await getDashboard(id);
    const userDashboards = await getUserDashboards();
    setAllUserDashboards(userDashboards.data);
    dispatch(setDashboardId(id));
    if (data) {
      setUserData(data?.data);
      fetchAllFolder();
      fetchAllForm();
    } else {
      toast.error("Permission denied");
      navigate("/login");
    }

  };

  const handleCreateFolder = async () => {
    setFolderNameError(""); 

    if (folderName.trim().length === 0) {
      setFolderNameError("Enter folder name");
      return;
    }

    const data = await createFolder(folderName, id);
    console.log(data);
    if (data) {
      setCreateModalOpen(false);
      fetchAllFolder();
    }
  };
  const handleShare = async (email,permission) => {
      console.log(id, email,permission)
      const data = await shareDashboard(id, {email, permission});
      console.log(data)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
    dispatch(clearDashboardId())
  }

  const handleCreateForm = async() => {

    if (formName.trim().length === 0) {
      setFormNameError("Enter form name");
      return;
    }
    const response = await createFormInDashboard(id, formName);

    if (response){
      setIsCreateFormModalOpen(false);
      fetchAllForm();
    }
  }

  const fetchAllFolder = async () => {
    const data = await getAllfolders(id);
    if (data) setAllFolder(data);
  };

  const deleteFolder = async () => {
    const data = await deleteFolderApi(folderId);
    console.log(data)
    if (data) {
      setDeleteModalOpen(false);
      fetchAllFolder();
    }
  };

  const fetchAllForm = async () => {
    const data = await getAllforms(id);
    if (data) setAllForm(data);
  };

  const handleDeleteForm = async () => {
    const data = await deleteForm(formId);
    if (data) {
      setDeleteModalOpen(false);
      fetchAllForm();
    }
  };

  useEffect(() => {
    // Apply the theme on mount
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);
  
  useEffect(() => {
    if (token) {
      userDashboard();
    }
  }, [token,id]);
  return (
    <main className={styles.dashboard}>
      <div className={styles.navbar}>
        <div
          className={`${styles.dropdown} ${isDropdownOpen ? styles.show : ""}`}
        >
          <button
            className={styles.dropdownBtn}
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <span>
              {userData.name
                ? userData.name
                : "workspace"}
            </span>
            <img
              className={styles.arrowDown}
              src="/icons/arrowDown.png"
              alt="arrow-down"
            />
          </button>
          <div className={styles.dropdownContent}>
            <Link to="/settings">Settings</Link>
            {
              allUserDashboards.map((dashboard) => (
                <Link 
                  key={dashboard._id} 
                  to={`/dashboard/${dashboard._id}`}
                >
                    {dashboard.name}
                </Link>
              ))
            }
            <p
              onClick={handleLogout}
              className={styles.logout}
            >
              Logout
            </p>
          </div>
        </div>


        <div
            className={styles.share}
        >
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

          <button
            onClick={openShareModal}
          >Share</button>
        </div>


        
      </div>
      <div className={styles.section}>
        <div className={styles.folders}>
          <button 
            className={styles.createOpen} 
            onClick={openCreateModal}>
            <img src="/icons/folderPlus.png" alt="folder icon" />
            <span>Create a folder</span>
          </button>
          <FolderButton
            folders={allFolder}
            onDelete={(id) => openDeleteModal(id)}
          />
        </div>
        <div className={styles.forms}>

          <button 
            onClick={openCreateFormModal}
            className={styles.card}>
            <img src="/icons/plus.png" alt="plus icon" />
            <span>Create a Form</span>
          </button>

          <FormCard
            forms={allForm}
            onDelete={(id, type) => openDeleteModal(id, type)}
          />
          {isCreateModalOpen && (
            <CreateFolderModal
              folderName={folderName}
              folderNameError={folderNameError}
              onNameChange={(e) => setFolderName(e.target.value)}
              onCreate={handleCreateFolder}
              onClose={() => setCreateModalOpen(false)}
            />
          )}
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
              entityType={entityType}
              onDelete={entityType === "folder" ? deleteFolder : handleDeleteForm}
              onClose={() => setDeleteModalOpen(false)}
            />
          )}
          {
            isShareModalOpen && (
              
              <ShareModal 
                handleShare={handleShare}
                onClose= {()=>setIsShareModalOpen(false)}
              />
            
            )
          }
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
