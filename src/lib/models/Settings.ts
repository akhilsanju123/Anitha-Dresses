import mongoose, { Schema, Document } from 'mongoose';
import { WebsiteSettings } from '../../types';

export interface ISettingsDocument extends Document, WebsiteSettings {}

const SettingsSchema = new Schema<ISettingsDocument>(
  {
    storeName: { type: String, required: true },
    storeTagline: { type: String },
    phone: { type: String },
    whatsappNumber: { type: String },
    email: { type: String },
    address: { type: String },
    googleMapUrl: { type: String },
    upiId: { type: String },
    qrCodeUrl: { type: String },
    bankName: { type: String },
    accountHolder: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    branchName: { type: String },
    gstNumber: { type: String },
    currency: { type: String, default: '₹' },
    defaultShippingCharge: { type: Number, default: 60 },
    freeShippingThreshold: { type: Number, default: 1499 },
    lowStockAlertThreshold: { type: Number, default: 5 },
    socialLinks: { type: Schema.Types.Mixed },
    banners: { type: Schema.Types.Mixed },
    sectionToggles: { type: Schema.Types.Mixed },
    cmsText: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettingsDocument>('Settings', SettingsSchema);
