import mongoose, { Types } from "mongoose";
import { ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER } from "../../utils/constant";
import { baseDateTimeFormat } from "../../helpers/date-format";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { IAnnouncement } from "./interfaces";

export const AnnouncementSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    default: "" 
  },
  thumbnail: { 
    type: String, 
    required: false, 
    default: "" 
  },
  cover:{
    type: String,
    required: false,
    default: ""
  },
  content: {
    type: String,
    required: false,
    default: ""
  },
  tenantId: { 
    type: String, 
    required: true, 
    default: ""
  },
  type: { 
    type: String, 
    enum: [ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER], 
    required: true, 
    default: ANNOUNCEMENT_TYPE_OFFICE 
  },
  status: { 
    type: String, 
    enum: ["published", "draft", "archived", "deleted"], 
    required: true, 
    default: "draft" 
  },
  createdBy: { 
    type: Types.ObjectId, 
    ref: "User", 
    required: false, 
    default: null
  },
  lastUpdatedBy: { 
    type: Types.ObjectId, 
    ref: "User", 
    required: false, 
    default: null
  },
}, { timestamps: true });

AnnouncementSchema.virtual("formattedCreatedAt").get(function(this: Document & IAnnouncement & { createdAt: Date }) {
    return this.createdAt ? baseDateTimeFormat(this.createdAt) : null;
});

AnnouncementSchema.virtual("formattedUpdatedAt").get(function(this: Document & IAnnouncement & { updatedAt: Date }) {
    return this.updatedAt ? baseDateTimeFormat(this.updatedAt) : null;
});

AnnouncementSchema.plugin(mongooseLeanVirtuals);

export const AnnouncementModel = mongoose.model("Announcement", AnnouncementSchema);