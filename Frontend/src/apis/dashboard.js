import axios from 'axios';

import { toast } from 'react-toastify';


const baseUrl = import.meta.env.VITE_BASEURL

export const getDashboard = async (id) => {
    
    try {
        
        const response = await axios.get(`${baseUrl}/dashboard/${id}`, {
            withCredentials: true,
        });
        // console.log(response)
        if(response.data.status === 'success'){
            return response.data

        }
        else{
            toast.error('permission denied');
            return response.data.status
        }
            
        
        
    } catch (error) {
        
    }
};

export const getAllforms = async (id) => {
    // console.log(id)
    try {
        const response = await axios.get(`${baseUrl}/form/${id}`, {
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

export const createFormInDashboard = async (id,name) => {
    try {
        const response = await axios.post(`${baseUrl}/form/${id}`, {name}, {
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
        if(error.response.data.message){
            toast.error(error.response.data.message);
        }
        else{
            toast.error('Server error');
        }
    }
}

export const shareDashboard = async (id, data) => {
    try {
        const response = await axios.post(`${baseUrl}/dashboard/share/${id}`, {data}, {
            withCredentials: true,
        })
        const {status, message} = response.data;

        if(status === 'success'){
            toast.success(message);
            return status;
        } else{
            toast.error(message);
            return null;
        }
        

    } catch (error){
        console.error(error);
        if(error.response.data.message){
            toast.error(error.response.data.message);

        }else {
            toast.error('Server error');
        }
        return null;

    }
}

export const getUserDashboards = async () => {
    try {
        const response = await axios.get(`${baseUrl}/dashboard/user`, {
            withCredentials: true,
        });

        return response.data; // Return the response data
    } catch (error) {
        console.error("Error fetching user workspaces:", error);

        // Handle error appropriately
        if (error.response) {
            throw new Error(error.response.data.message || "Failed to fetch workspaces");
        } else {
            throw new Error("Network error or server is not reachable");
        }
    }
}