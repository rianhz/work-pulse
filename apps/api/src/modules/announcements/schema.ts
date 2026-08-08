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
  isFeatured: {
    type: Boolean,
    required: false,
    default: false
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
  publishedAt: {
    type: Date,
    required: false,
    default: null
  },
  publishedBy: { 
    type: Types.ObjectId, 
    ref: "User", 
    required: false, 
    default: null
  },
  labelColor: {
    type: String,
    required: false,
    default: ""
  },
  labelText: {
    type: String,
    required: false,
    default: ""
  }
}, { timestamps: true, id: false });

AnnouncementSchema.virtual("formattedCreatedAt").get(function(this: Document & IAnnouncement & { createdAt: Date }) {
    return this.createdAt ? baseDateTimeFormat(this.createdAt) : null;
});

AnnouncementSchema.virtual("formattedUpdatedAt").get(function(this: Document & IAnnouncement & { updatedAt: Date }) {
    return this.updatedAt ? baseDateTimeFormat(this.updatedAt) : null;
});

AnnouncementSchema.virtual("formattedPublishedAt").get(function(this: Document & IAnnouncement & { publishedAt: Date }) {
    return this.publishedAt ? baseDateTimeFormat(this.publishedAt) : null;
});

AnnouncementSchema.plugin(mongooseLeanVirtuals);

export const AnnouncementModel = mongoose.model("Announcement", AnnouncementSchema);