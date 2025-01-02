import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import styles from './EditForm.module.css'
import Navbar from '../../components/navbar/Navbar'
import useAuth from '../../hooks/useAuth'
import { fetchFormById, updateForm } from '../../apis/form'
import FormBox from '../../components/FormBox'
import { toast } from 'react-toastify'

const EditForm = () => {
    const {formId:id} = useParams()
    const token = useAuth();

    const [formId, setFormId] = useState(id);
    const [formBox, setFormBox] = useState([]);
    const [formBoxError, setFormBoxError] = useState({});
    const [clickCounts, setClickCounts] = useState({});
    console.log("formbox", formBox)
    const adminButtons = [
        { role: "admin", src: "chat.png", type: "Text", hint: "Click here to edit", value: "" },
        { role: "admin", src: "photo.png", type: "Image", hint: "Click to add link", value: "" },
        { role: "admin", src: "video.png", type: "Video", hint: "Click to add link", value: "" },
        { role: "admin", src: "gif.png", type: "GIF", hint: "Click to add link", value: "" }
    ];

    const userButtons = [
        { role: "user", src: "text.png", type: "Text", hint: "input a text on his form" },
        { role: "user", src: "hash.png", type: "Number", hint: "input a number on his form" },
        { role: "user", src: "at.png", type: "Email", hint: "input a email on his form" },
        { role: "user", src: "call.png", type: "Phone", hint: "input a phone on his form" },
        { role: "user", src: "calendar.png", type: "Date", hint: "select a date" },
        { role: "user", src: "star.png", type: "Rating", hint: "tap to rate out of 5" },
        { role: "user", src: "checkbox.png", type: "Button", hint: "Click to add button text", value: "" }
    ];

    const handleAddBox = (data) => {
        if (!formId) { toast.error("Enter form name and hit save."); return }
        const key = `${data.role}-${data.type}`;
        const newCount = (clickCounts[key] || 0) + 1;
        setClickCounts((prevCounts) => ({ ...prevCounts, [key]: newCount }));

        setFormBox([...formBox, { key: key + ":" + newCount, data }]);
    };

    const handleRemoveBox = (index) => {
        const oldbox = formBox[index];
        const [oldKey, oldVal] = oldbox.key.split(":");

        const newbox = formBox.filter((_, idx) => idx !== index);
        const newFormBox = newbox.map((element) => {
            const [curKey, curVal] = element.key.split(":");

            if (curKey === oldKey && parseInt(curVal) > oldVal) {
                const newele = { ...element };
                newele.key = curKey + ":" + (parseInt(curVal) - 1);
                return newele;
            } else {
                return element;
            }
        });

        const newCount = (clickCounts[oldKey] || 0) - 1;
        setClickCounts((prevCounts) => ({ ...prevCounts, [oldKey]: newCount }));

        setFormBox(newFormBox);
    };

    const getFormBoxValue = (index, value) => {
        const newFormBox = formBox.map((element, idx) => {
            if (idx == index) {
                const newele = { ...element };
                newele.data.value = value;
                return newele;
            } else {
                return element;
            }
        });

        setFormBox(newFormBox);

        setFormBoxError(prevErrors => ({
            ...prevErrors, [index]: value === '' ? 'Required Field' : null
        }));
    };

    const handlefetchFormById = async () => {
        const data = await fetchFormById(formId);
        console.log("data",data)
        if (data) setFormBox(data.sequence);
    };

    const updateFormSequence = async () => {
        let error = false;
        const newErrors = {};

        formBox.forEach((element, index) => {
            const { role, type, value } = element.data;

            if (role === 'admin' || (role === 'user' && type === 'Button')) {
                if (!value) {
                    error = true;
                    newErrors[index] = 'Required Field';
                }
            }
        });

        setFormBoxError(newErrors);

        if (!error) {
            const data = await updateForm(formId, { sequence: formBox });
            if (data) toast.success("Form updated successfully.");
        }
    };

    useEffect(() => {
        const result = {};
        formBox?.forEach(element => {
            const { role, type } = element.data;
            const roleTypeKey = `${role}-${type}`;

            if (result[roleTypeKey]) {
                result[roleTypeKey]++;
            } else {
                result[roleTypeKey] = 1;
            }
        });

        setClickCounts(result);
    }, [formBox]);

    useEffect(() => {
        if (token) {
            if (formId) handlefetchFormById();
        }
    }, [token]);
  return (
    <main className={styles.workspace}>
            <Navbar 
                setWorkspaceId={setFormId} 
                updateFormSequence={updateFormSequence} 
            />
            <div className={styles.space}>
                <div className={styles.sidebar}>
                    <span>Bubbles</span>
                    <div className={styles.bubbles}>
                        {adminButtons.map((button, index) => (
                            <button key={index} onClick={() => handleAddBox(button)}>
                                <img src={`/icons/${button.src}`} alt={`${button.src} icon`} />{button.type}
                            </button>
                        ))}
                    </div>
                    <span>Inputs</span>
                    <div className={styles.inputs}>
                        {userButtons.map((button, index) => (
                            <button key={index} onClick={() => handleAddBox(button)}>
                                <img src={`/icons/${button.src}`} alt={`${button.src} icon`} />{button.type}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.layout}>
                    <div className={styles.card}>
                        <div className={styles.start}>
                            <img src="/icons/flag.png" alt="flag icon" />
                            <span className={styles.title}>Start</span>
                        </div>
                    </div>
                    {formBox?.map((button, index) => (
                        <FormBox
                            key={index}
                            button={button}
                            index={index}
                            handleRemoveBox={handleRemoveBox}
                            getFormBoxValue={getFormBoxValue}
                            formBoxError={formBoxError}
                        />
                    ))}
                    <div className={styles.endCard}></div>
                </div>
            </div>
        </main>
  )
}

export default EditForm