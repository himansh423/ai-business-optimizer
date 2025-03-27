import connectToDatabase from "@/library/database/db";
import Business from "@/library/model/BusinessSchema";
import User from "@/library/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const UserId = (await params).id;
    const payload = await req.json();
    await connectToDatabase();

    const user = await User.findById(UserId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const saveBusiness = new Business({
      businessBy: user._id,
      businessName: payload.businessName,
      businessType: payload.businessType,
      businessDescription: payload.businessDescription,
      businessAddress: payload.businessAddress,
      businessCity: payload.businessCity,
      businessExteriorImage: payload.businessExteriorImage,
      businessInteriorImage: payload.businessInteriorImage,
      businessProductImage: payload.businessProductImage,
      businessProductDescription: payload.businessProductDescription,
      businessWebsite: payload.businessWebsite,
      businessPhone: payload.businessPhone,
      businessEmail: payload.businessEmail,
      businessSocialMedia: payload.businessSocialMedia,
      establishedDate: payload.establishedDate,
      businessCategories: payload.businessCategories,
      businessTags: payload.businessTags,
      operatingHours: payload.operatingHours,
      Ameneities: payload.Ameneities,
      googleBusinessProfile: payload.googleBusinessProfile,
      onlineOrderingPlatforms: payload.onlineOrderingPlatforms,
      revenue: payload.revenue,
    });

    const savedBusiness = await saveBusiness.save();
    user.business = savedBusiness._id;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Business details added successfully",
        business: savedBusiness,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
  }
}
