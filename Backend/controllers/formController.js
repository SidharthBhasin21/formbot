const Form = require("../models/formModel");
const Folder = require("../models/folderModel");
const dashboardModel = require("../models/dashboardModel");
const { default: mongoose } = require("mongoose");


module.exports.createForm = async (req, res) => {
    try {
        const { dashboardId } = req.params;
        const {name} = req.body;

        console.log("formName:",req.body)

        // Validate input
        if (!name) {
            return res.status(400).json({
                status: "error",
                message: "Form name is required",
            });
        }

        // Find the folder by ID
        const folder = await dashboardModel.findById(dashboardId);

        if (!folder) {
            return res.status(404).json({
                status: "error",
                message: "folder not found",
            });
        }

        // Create a new form
        const newForm = new Form({
            name,
            owner: req.user._id, // Assuming req.user contains the authenticated user's ID
            folder: dashboardId, // Link the form to the folder
        });
        // Save the form to the database
        await newForm.save();

        // Add the form to the folder's forms array
        folder.forms.push(newForm._id);
        await folder.save();

        res.status(201).json({
            status: "success",
            message: "Form created successfully",
            form: newForm,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: error.message,
        });
    }
};


module.exports.createFormInFolder = async(req,res)=>{
    try {
        const { folderId } = req.params;
        const { name} = req.body;

        console.log(folderId)

        // Validate input
        if (!name) {
            return res.status(400).json({
                status: "error",
                message: "Form name is required",
            });
        }

        // Find the folder by ID
        const folder = await Folder.findById(folderId);

        if (!folder) {
            return res.status(404).json({
                status: "error",
                message: "Folder not found",
            });
        }

        // Create a new form
        const newForm = new Form({
            name,
            owner: req.user._id, // Assuming req.user contains the authenticated user's ID
            folder: folderId, // Link the form to the folder
        });

        // Save the form to the database
        await newForm.save();

        // Add the form to the folder's forms array
        folder.forms.push(newForm._id);
        await folder.save();

        res.status(201).json({
            status: "success",
            message: "Form created successfully inside the folder",
            form: newForm,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: error.message,
        });
    }
}

module.exports.getForm = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ 
                staus: "error",
                message: "Form not found" 
            });
        }

        // Check if the user is authorized to view this form
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                staus: "error",
                message: "You do not have permission to view this form" });
        }

        res.status(200).json({ 
            status: "success",
            form });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
module.exports.deleteForm = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);

        if (!form) {
            return res.status(404).json({ 
                status: "error",
                message: "Form not found" });
        }

        // Check if the user is the owner of the form
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                status: "error",
                message: "You do not have permission to delete this form" });
        }

        // Remove the form from its folder if applicable
        if (form.folder) {
            const folder = await Folder.findById(form.folder);
            folder.forms.pull(form._id);
            await folder.save();
        }

        await Form.findByIdAndDelete(form._id);

        res.status(200).json({
            status: "success",
            message: "Form deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: "error",
            message: "Server error", error: error.message });
    }
}
module.exports.getAllForms = async (req, res) => {
    try {
        const { dashboardId } = req.params;
        // console.log(dashboardId)

        const folder = await dashboardModel.findById(dashboardId).populate("forms");
        if (!folder) {
            return res.status(404).json({ 
                status: "error",
                message: "folder not found" 
            });
        }

        res.status(200).json({
            status: "success",
            message: "Forms fetched successfully",
            forms: folder.forms,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Server errorsdfs",
            error: error.message,
        });
    }
}

module.exports.getAllformsInFolder = async (req,res)=>{
    try {
        const { folderId } = req.params;
        // console.log(dashboardId)

        const folder = await Folder.findById(folderId).populate("forms");
        
        if (!folder) {
            return res.status(404).json({ 
                status: "error",
                message: "folder not found" 
            });
        }

        res.status(200).json({
            status: "success",
            message: "Forms fetched successfully",
            forms: folder.forms,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Server errorsdfs",
            error: error.message,
        });
    }
}

module.exports.updateForm = async (req, res) => {
    const { formId } = req.params;
    try {
        const { name,  sequence } = req.body;
        console.log(formId)
        // console.log(req.body) 
        

        const form = await Form.findByIdAndUpdate(formId, { sequence });
        res.status(200).json({ status: "success", message: "Form updated successfully.", form});
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Server error", error: err.message });
    }
}
module.exports.shareForm = async (req, res, next) => {
    const { formId } = req.params;
    try {
        if(mongoose.Types.ObjectId.isValid(formId)){
            const formdata = await Form.findById(formId);
            if (!formdata) {
                return res.status(404).json({
                    status: 'error',
                    message: "Invalid! please check the URL."
                })
            } 
            res.status(200).json({ 
                status: "success", 
                message: "fetched Successfully",
                data: formdata });
        }else {
            return res.status(400).json({
                status: 'error',
                message: "Invalid! please check the URL."
            })
            
        }
    } catch (err) {
        console.log(err.message)
        return null;
    }
};
module.exports.countFormHit = async (req, res, next) => {
    const { formId } = req.params;
    console.log("formId",formId)
    try {
        const formdata = await Form.findById(formId);

        if (!formdata) {
            return res.status(404).json({
                status: 'error',
                message: "Invalid! please check the URL."
            })
        }
        const views = formdata.views + 1;
        await Form.findByIdAndUpdate(formId, { views });
        console.log("Views",views)
        res.status(200).json({ 
            status: "success", 
            message: "Hit count : " + views
        });
    } catch (err) {
        console.log(err.message)
        return null;
    }
};

module.exports.saveFormResponse = async (req, res, next) => {
    const { formId } = req.params;
    try {

        const formdata = await Form.findById(formId);
        const formResponse = req.body;
        console.log(formdata)

        const index = formdata.formResponse.findIndex(
            response => response.vid === formResponse.vid
        );

        if (index !== -1) {
            formdata.formResponse[index] = formResponse;
        } else {
            formdata.formResponse.push(formResponse);
        }
        await formdata.save();

        res.status(200).json({ status: "success", data: formdata });
    } catch (err) {
        next(err);
    }
};

const validateFormData = async (formId) => {
    if (!ObjectId.isValid(formId)) {
        throw Object.assign(Error("This form is not valid, please check your URL"), { code: 400 });
    }

    const formdata = await Form.findById(formId);
    if (!formdata) {
        throw Object.assign(Error("This form is not valid, please check your URL."), { code: 404 });
    }

    return formdata;
};