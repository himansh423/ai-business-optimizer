import mongoose from "mongoose";

const businessSocialMediaSchema = new mongoose.Schema(
  {
    businessInstagram: { type: String },
    businessFacebook: { type: String },
    businessTwitter: { type: String },
    businessLinkedin: { type: String },
    businessYoutube: { type: String },
    businessPinterest: { type: String },
  },
  { _id: false }
);

const businessPhoneSchema = new mongoose.Schema({
  countryCode: { type: String },
  number: {
    type: String,
  },
});
const businessSchema = new mongoose.Schema({
  businessBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  businessName: { type: String, required: true },
  businessType: { type: String },
  businessDescription: { type: String },
  businessAddress: { type: String },
  businessCity: { type: String },
  businessExteriorImage: [{ type: String }],
  businessInteriorImage: [{ type: String }],
  businessProductImage: [{ type: String }],
  businessProductDescription: { type: String },
  businessWebsite: { type: String },
  businessPhone: { type: businessPhoneSchema },
  businessEmail: { type: String },
  businessSocialMedia: { type: businessSocialMediaSchema },
  establishedDate: { type: Date },
  businessCategories: [{ type: String }],
  businessTags: [{ type: String }],
  operatingHours: { type: String },
  Ameneities: { type: String },
  googleBusinessProfile: { type: String },
  onlineOrderingPlatforms: [{ type: String }],
  revenue: { type: String },
});

const Business =
  mongoose.models.Business || mongoose.model("Business", businessSchema);
export default Business;
