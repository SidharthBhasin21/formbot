const dashboardModel = require("../models/dashboardModel");
const User = require("../models/userModel");


module.exports.getDashboard = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const userId = req.user._id;
    
    try {
        const dashboard = await dashboardModel.findById(id)
            .populate("owner", "name email") // Populate owner details (name, email)
            .populate("members.user", "name email") // Populate members' details (name, email)
            .populate("folders") // Populate folder references
            .populate("forms");
            
        if (!dashboard) {
            return res.status(404).json({ 
                status: "error",
                message: "dashboard not found" });
        }

        const isOwner = dashboard.owner._id.toString() === userId.toString();
        const isMember = dashboard.members.some(
            (member) => member.user._id.toString() === userId.toString()
        );

        if (!isOwner && !isMember) {
            return res.status(403).json({ 
                status: "error", 
                message: "You do not have permission to access this dashboard" 
            });
        }

        res.status(200).json({
            status: "success",
            data: dashboard,
        });

    } catch (error) {
        console.error("Error fetching dashboard:", error);
        res.status(500).json({ 
            status: "error",
            message: error.message 
        });
    }
}

module.exports.shareDashboard = async (req, res) => {
    const { dashboardId } = req.params;
    const { email, permission } = req.body.data;

    console.log(req.body);
    console.log(dashboardId);
    // Validate permission type
    if (!["view", "edit"].includes(permission)) {
        return res.status(400).json({
            status: "error",
            message: "Permission must be either 'view' or 'edit'",
        });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User with the provided email not found",
            });
        }

        // Find the workspace (dashboard)
        const dashboard = await dashboardModel.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({
                status: "error",
                message: "dashboard not found",
            });
        }

        // Check if the current user is the owner of the workspace
        if (dashboard.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: "error",
                message: "Only the dashboard owner can share it",
            });
        }

        // Check if the user is already a member
        const isAlreadyMember = dashboard.members.some(
            (member) => member.user.toString() === user._id.toString()
        );
        if (isAlreadyMember) {
            return res.status(400).json({
                status: "error",
                message: "User is already a member of the workspace",
            });
        }

        // Add the user to the members array
        dashboard.members.push({
            user: user._id,
            permissions: permission,
        });
        await dashboard.save();

        res.status(200).json({
            status: "success",
            message: `Workspace shared successfully with ${user.email} as ${permission}`,
        });
    } catch (error) {
        console.error("Error sharing workspace:", error);
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: error.message,
        });
    }
};
module.exports.getUserDashboards= async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user's ID

        // Find all workspaces where the user is either the owner or a member
        const workspaces = await dashboardModel.find({
            $or: [
                { owner: userId }, // Owned workspaces
                { "members.user": userId }, // Member workspaces
            ],
        })
            .populate("owner", "name email") // Populate owner details
            .populate("members.user", "name email"); // Populate member details

        if (workspaces.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No workspaces found for this user",
            });
        }

        res.status(200).json({
            status: "success",
            data: workspaces,
        });
    } catch (error) {
        console.error("Error fetching user workspaces:", error);
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: error.message,
        });
    }
};
