const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [
        {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        permissions: { type: String, enum: ["view", "edit"], required: true }, 
        },
    ],
    folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
    forms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form" }],
});

module.exports = mongoose.model("Dashboard", dashboardSchema);
