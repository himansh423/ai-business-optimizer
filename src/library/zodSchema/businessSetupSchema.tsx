import { z } from "zod"

// Define the business type enum as a constant to ensure type safety
const BusinessType = {
  Offline: "Offline",
  Online: "Online",
  Both: "Both",
} as const

// Create a dynamic schema based on business type
export const businessForm = z
  .object({
    businessName: z.string().min(1, "Business name is required"),
    businessType: z.enum([BusinessType.Offline, BusinessType.Online, BusinessType.Both]),
    businessDescription: z.string().min(50, "Business description should be at least 50 characters"),
    businessAddress: z.string().optional(),
    businessCity: z.string().optional(),
    businessProductDescription: z.string().min(50, "Product description should be at least 50 characters"),
    establishedDate: z.date().optional(),
    businessEmail: z.string().email("Invalid email address"),
    businessPhone: z.object({
      countryCode: z.string(),
      number: z.string().min(5, "Phone number is required"),
    }),
    businessWebsite: z.string().url("Invalid URL").optional(),
    businessSocialMedia: z
      .object({
        businessInstagram: z.string().optional(),
        businessFacebook: z.string().optional(),
        businessTwitter: z.string().optional(),
        businessLinkedin: z.string().optional(),
        businessYoutube: z.string().optional(),
        businessPinterest: z.string().optional(),
      })
      .optional(),
    googleBusinessProfile: z.string().optional(),
    operatingHours: z.string().min(1, "Operating hours are required"),
    Ameneities: z.string().optional(),
    revenue: z.string().min(1, "Revenue range is required"),
  })
  .refine(
    (data) => {
      if (data.businessType === BusinessType.Offline || data.businessType === BusinessType.Both) {
        return !!data.businessAddress && data.businessAddress.length >= 5
      }
      return true
    },
    {
      message: "Business address is required for physical businesses",
      path: ["businessAddress"],
    },
  )
  .refine(
    (data) => {
      if (data.businessType === BusinessType.Offline || data.businessType === BusinessType.Both) {
        return !!data.businessCity && data.businessCity.length >= 2
      }
      return true
    },
    {
      message: "Business city is required for physical businesses",
      path: ["businessCity"],
    },
  )
  .refine(
    (data) => {
      if (data.businessType === BusinessType.Offline || data.businessType === BusinessType.Both) {
        return !!data.Ameneities && data.Ameneities.length > 0
      }
      return true
    },
    {
      message: "Amenities are required for physical businesses",
      path: ["Ameneities"],
    },
  )
  .refine(
    (data) => {
      if (data.businessType === BusinessType.Online || data.businessType === BusinessType.Both) {
        return !!data.businessWebsite && data.businessWebsite.length > 0
      }
      return true
    },
    {
      message: "Website URL is required for online businesses",
      path: ["businessWebsite"],
    },
  )
  .refine(
    (data) => {
      if (data.businessType === BusinessType.Online || data.businessType === BusinessType.Both) {
        return !!data.googleBusinessProfile && data.googleBusinessProfile.length > 0
      }
      return true
    },
    {
      message: "Google Business Profile is required for online businesses",
      path: ["googleBusinessProfile"],
    },
  )

// Export the BusinessType for use in components
export { BusinessType }
