const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  background: { type: String },
  sequence: {
    type: Array,
  },
  fields: [
    {
      label: { type: String, required: true },
      placeholder: { type: String },
      type: { type: String, required: true }, 
      required: { type: Boolean, default: false },
    },
  ],
  formResponse: {
    type: Array
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  shareableLink: { type: String },
  views: { type: Number, default: 0 },
  completions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Form", formSchema);
