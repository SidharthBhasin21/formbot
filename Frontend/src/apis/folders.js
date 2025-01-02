import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_BASEURL

export const createFolder = async (name,id) => {
    try {
        const response = await axios.post(`${baseUrl}/folder/create`, {name,id}, {
            withCredentials: true,
        });

        const { status, message } = response.data;
        if (status === 'success') {
            toast.success(message);
            return true;
        } else {
            toast.error(message);
            return false;
        }
    } catch (error) {
        console.error(error);
        toast.error('Server error');
        return false;
    }
}
export const getAllfolders = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/folder/${id}`, {
            withCredentials: true,
        });
        const { status, folders } = response.data;
        if (status === 'success') {
            
            return folders;
        } else {
            toast.error('Failed to fetch folders');
            return null;
        }
    } catch (error) {
        console.error(error);
        toast.error('Server error');
        return null;
    }
}

export const deleteFolderApi = async (folderId) => {
    try {
        const response = await axios.delete(`${baseUrl}/folder/${folderId}`, {
            withCredentials: true,
        });

        const { status, message } = response.data;
        if (status === 'success') {
            toast.success(message);
            return true;
        } else {
            toast.error(message);
            return false;
        }
    } catch (error) {
        console.error(error);
        toast.error('Server error: '+ error.message);
        return false;
    }
};