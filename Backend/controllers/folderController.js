const Folder = require("../models/folderModel");
const Dashboard  =require("../models/dashboardModel");
const formModel = require("../models/formModel");

module.exports.createFolder = async (req, res) => {
    try {
        const { name, id: dashboardId } = req.body;
        
        // console.log(req.body);
        if (!name || !dashboardId) {
            return res.status(400).json({ 
                status: "error",
                message: "Folder name and you should be in a dashboard" 
            });
        }

        const dashboard = await Dashboard.findById(dashboardId);

        if (!dashboard) {
            return res.status(404).json({ 
                status: "error",
                message: "Dashboard not found" 
            });
        }

        const isOwner = dashboard.owner.toString() === req.user._id.toString();
        const isEditor = dashboard.members.some(
            (member) =>
                member.user.toString() === req.user._id.toString() &&
                member.permissions === "edit"
        );

        if (!isOwner && !isEditor) {
            return res.status(403).json({ 
                status: "error",
                message: "You do not have permission to create folders in this dashboard" 
            });
        }
        // Create a new folder
        const newFolder = new Folder({
            name,
            owner: req.user._id,
        });

        // Save the folder to the database
        await newFolder.save();

        // Add the folder to the dashboard
        const updatedDashboard = await Dashboard.findByIdAndUpdate(
            dashboardId,
            { $push: { folders: newFolder._id } },
            { new: true }
        )
        if (!updatedDashboard) {
            return res.status(404).json({ 
                status: "error",
                message: "Dashboard not found" });
        }


        res.status(201).json({
            status: "success",
            message: "Folder created successfully",
            folder: newFolder,
            dashboard: updatedDashboard
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: "error",
            message: "Server error", 
            error: error.message
        });
    }
}
module.exports.getFolder = async (req, res) => {
    try {
        const folderId = req.params.id;

        // Find the folder by ID
        const folder = await Folder.findById(folderId).populate("forms");

        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        // Check if the folder belongs to the logged-in user
        if (folder.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You do not have permission to access this folder" });
        }

        res.status(200).json({ folder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
module.exports.deleteFolder = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id);
        
        if (!folder) {
            return res.status(404).json({ 
                status: "error",
                message: "Folder not found" 
            });
        }

        // Check if the folder belongs to the logged-in user
        if (folder.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                status: "error",
                message: "You do not have permission to delete this folder" });
        }

        // Check if the folder contains any forms
        const formsInFolder = await formModel.find({ folder: folder._id });
        if (formsInFolder.length > 0) {
            return res
                .status(400)
                .json({ 
                    status: "error",
                    message: "Folder contains forms. Delete forms before deleting the folder." });
        }

        // Delete the folder
        await Folder.findByIdAndDelete(folder._id);

        res.status(200).json({ 
            status: "success",
            message: "Folder deleted successfully" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: "error",
            message: "Server error: " + error.message });
    }
}

module.exports.getAllFolders = async (req, res) => {
    try {
        const { dashboardId } = req.params;

        // Find the dashboard by ID and populate the folders
        const dashboard = await Dashboard.findById(dashboardId).populate("folders");

        if (!dashboard) {
            return res.status(404).json({ 
                status: "error",
                message: "dashboard not found" 
            });
        }

        res.status(200).json({
            status: "success",
            message: "Folders fetched successfully",
            folders: dashboard.folders,
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