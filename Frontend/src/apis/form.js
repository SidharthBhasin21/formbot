import axios from "axios";
import { toast } from "react-toastify";


const baseUrl = import.meta.env.VITE_BASEURL


export const deleteForm = async (id) => {
    try {
        const response = await axios.delete(`${baseUrl}/form/${id}`, {
            withCredentials: true,
        });
        const { message } = response.data;
        toast.success(message);
        return true;
    } catch (error) {
        console.error(error);
        toast.error('Server error: '+ error.message);
        return null;
    }
}

export const createFormInFolder = async (id,name)=>{
    console.log(id)
    try {
        const response = await axios.post(`${baseUrl}/form/folder/${id}`, {name}, {
            withCredentials: true,
        });
        const { status, form } = response.data;
        if (status === 'success') {
            toast.success(`${form.name} Form created successfully`);
            return status;
        } else {
            toast.error('Failed to create form');
            return null;
        }
        

    } catch (error) {
        console.error(error);
        toast.error('Server error');
        return null;
    }
}

export const getAllformsInFolder = async (id,name)=>{
    try {
        const response = await axios.get(`${baseUrl}/form/folder/${id}`, {
            withCredentials: true,
        });
        // console.log(response.data)

        const { status, forms } = response.data;
        if (status === 'success') {
            return forms;
        } else {
            toast.error('Failed to fetch forms');
            return null;
        }
    } catch (error) {
        console.error(error);
        toast.error('Server error');
        return null;
    }
}
export const createFormApi = async (folderId, formName, token) => {}

export const fetchFormById = async (formId) => {
    try {
        const response = await axios.get(`${baseUrl}/form/update/${formId}`, {
            withCredentials: true,
        });
        console.log(response)
        const { status, form } = response.data;
        if (status === 'success') {
            return form;
        } else {
            toast.error('Failed to fetch form');
            return null;
        }
    } catch (error) {
        if(error.response.data.message)
        toast.error(error.response.data.message);
        else toast.error("Server Error")
        return null;
        
    }
}

export const updateForm = async (formId, sequence) => {
    try {
        const response = await axios.patch(`${baseUrl}/form/update/${formId}`, sequence , {
            withCredentials: true
        });

        const { status } = response.data;
        if (status === 'success') {
            return true;
        } else {
            toast.error('Failed to update form');
            return null;
        }
    } catch (error) {
        toast.error(error.message)
    }
}

export const shareForm = async (formId) => {
    try {
        const response = await axios.get(`${baseUrl}/form/share/${formId}`);

        const { status, data } = response.data;
        if (status === 'success') {
            return data;
        } else {
            handleApiRes(response.data);
        }
    } catch (error) {
        handleApiErr(error, navigate);
    }
};

export const vewsInc = async (formId) => {
    console.log(formId)
    try {
        const response = await axios.post(`${baseUrl}/form/hits/${formId}`);
        const { status, message } = response.data;
        if (status === 'success') {
            return message;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};
export const saveFormResponse = async (formId, formResponse) => {
    console.log(formResponse)
    try {
        const response = await axios.post(`${baseUrl}/form/response/${formId}`, formResponse);

        const { status, message, data } = response.data;
        if (status === 'success') {
            return data;
        } else {
            toast.success(message)
            return null;
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message)
        return null;
    }
};