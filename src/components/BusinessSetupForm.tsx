"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import type * as z from "zod";
import {
  Building,
  ImagePlus,
  Upload,
  Calendar,
  Mail,
  Phone,
  Tag,
  Clock,
  Coffee,
  DollarSign,
  ShoppingBag,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  PinIcon as Pinterest,
} from "lucide-react";
import { inter } from "@/constants/fonts";
import { borderColor } from "@/constants/colors";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { businessForm } from "@/library/zodSchema/businessSetupSchema";
import { countryCodes } from "@/constants/countryCodes";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { businessSetupFormAction } from "@/redux/businessSetupFormSlice";
import axios from "axios";

type FormValues = z.infer<typeof businessForm>;
type Category = "exterior" | "interior" | "productImages";

const BusinessSetupForm = () => {
  const {
    businessCategories,
    businessTags,
    orderingPlatforms,
    date,
    selectedCountryCode,
  } = useSelector((store: RootState) => store.businessSetupForm);
  const dispatch = useDispatch();

  const [exteriorFiles, setExteriorFiles] = useState<File[]>([]);
  const [interiorFiles, setInteriorFiles] = useState<File[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(businessForm),
    defaultValues: {
      businessName: "",
      businessType: "Both",
      businessDescription: "",
      businessAddress: "",
      businessCity: "",
      businessProductDescription: "",
      businessEmail: "",
      businessPhone: {
        countryCode: "+1",
        number: "",
      },
      businessWebsite: "",
      businessSocialMedia: {
        businessInstagram: "",
        businessFacebook: "",
        businessTwitter: "",
        businessLinkedin: "",
        businessYoutube: "",
        businessPinterest: "",
      },
      googleBusinessProfile: "",
      operatingHours: "",
      Ameneities: "",
      revenue: "",
    },
    mode: "onChange",
  });

  const businessType = form.watch("businessType");

  useEffect(() => {
    if (date) {
      form.setValue("establishedDate", new Date(date));
    }
  }, [date, form]);

  useEffect(() => {
    if (selectedCountryCode) {
      form.setValue("businessPhone.countryCode", selectedCountryCode);
    }
  }, [selectedCountryCode, form]);

  useEffect(() => {
    if (businessType === "Online") {
      if (exteriorFiles.length > 0 || interiorFiles.length > 0) {
        setExteriorFiles([]);
        setInteriorFiles([]);
      }
    }
  }, [businessType, exteriorFiles.length, interiorFiles.length]);

  const handleCategoryChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !businessCategories.includes(value)) {
        dispatch(
          businessSetupFormAction.setBusinessCategories({
            data: [...businessCategories, value],
          })
        );
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const handleTagChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !businessTags.includes(value)) {
        dispatch(
          businessSetupFormAction.setBusinessTags({
            data: [...businessTags, value],
          })
        );
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const handlePlatformChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !orderingPlatforms.includes(value)) {
        dispatch(
          businessSetupFormAction.setOrderingPlatforms({
            data: [...orderingPlatforms, value],
          })
        );
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const removeCategory = (category: string) => {
    dispatch(
      businessSetupFormAction.setBusinessCategories({
        data: businessCategories.filter((c) => c !== category),
      })
    );
  };

  const removeTag = (tag: string) => {
    dispatch(
      businessSetupFormAction.setBusinessTags({
        data: businessTags.filter((t) => t !== tag),
      })
    );
  };

  const removePlatform = (platform: string) => {
    dispatch(
      businessSetupFormAction.setOrderingPlatforms({
        data: orderingPlatforms.filter((p) => p !== platform),
      })
    );
  };

  // Remove a file from the list
  const removeFile = (
    index: number,
    files: File[],
    setter: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setter(newFiles);
  };

  const validateImagesBasedOnBusinessType = () => {
    let isValid = true;
    let errorMessage = "";

    if (businessType === "Offline" || businessType === "Both") {
      if (exteriorFiles.length === 0) {
        isValid = false;
        errorMessage = "Exterior images are required for physical businesses";
      } else if (interiorFiles.length === 0) {
        isValid = false;
        errorMessage = "Interior images are required for physical businesses";
      }
    }

    if (productImages.length === 0) {
      isValid = false;
      errorMessage = "Product images are required";
    }

    if (!isValid) {
      alert(errorMessage);
    }

    return isValid;
  };

  const validateCategoriesAndTags = () => {
    let isValid = true;
    let errorMessage = "";

    if (businessCategories.length === 0) {
      isValid = false;
      errorMessage = "At least one business category is required";
    } else if (businessTags.length === 0) {
      isValid = false;
      errorMessage = "At least one business tag is required";
    }

    if (businessType === "Online" || businessType === "Both") {
      if (orderingPlatforms.length === 0) {
        isValid = false;
        errorMessage = "At least one online ordering platform is required";
      }
    }

    if (!isValid) {
      alert(errorMessage);
    }

    return isValid;
  };

  //  submitting and uploading Logic

  const onSubmit = async (data: FormValues) => {
    if (!validateImagesBasedOnBusinessType() || !validateCategoriesAndTags()) {
      return;
    }

    try {
      const preparePayload = (files: File[]) =>
        files.map((file) => ({
          name: file.name,
          type: file.type,
        }));

      const { data: presignedData } = await axios.post(
        "/api/get-presigned-url-to-upload-on-s3",
        {
          exterior: preparePayload(exteriorFiles),
          interior: preparePayload(interiorFiles),
          productImages: preparePayload(productImages),
        }
      );

      const uploads: {
        uploadUrl: string;
        key: string;
        originalFileName: string;
        category: Category;
      }[] = presignedData.uploads;

      const createFileObject = (file: File, category: Category) => ({
        file,
        category,
      });

      const allFiles: { file: File; category: Category }[] = [
        ...exteriorFiles.map((file) => createFileObject(file, "exterior")),
        ...interiorFiles.map((file) => createFileObject(file, "interior")),
        ...productImages.map((file) => createFileObject(file, "productImages")),
      ];

      const uploadedKeys = {
        exteriorImages: [] as string[],
        interiorImages: [] as string[],
        productImages: [] as string[],
      };

      for (const { uploadUrl, key, originalFileName, category } of uploads) {
        const fileToUpload = allFiles.find(
          (f) => f.file.name === originalFileName && f.category === category
        );

        if (fileToUpload) {
          await axios.put(uploadUrl, fileToUpload.file, {
            headers: {
              "Content-Type": fileToUpload.file.type,
            },
          });

          // Store the S3 key based on category
          switch (category) {
            case "exterior":
              uploadedKeys.exteriorImages.push(key);
              break;
            case "interior":
              uploadedKeys.interiorImages.push(key);
              break;
            case "productImages":
              uploadedKeys.productImages.push(key);
              break;
          }
        }
      }

      // Step 3: Save the business data with the uploaded image keys
      const formData = {
        ...data,
        businessCategories,
        businessTags,
        onlineOrderingPlatforms:
          businessType === "Offline" ? [] : orderingPlatforms,
        businessExteriorImage:
          businessType === "Online" ? [] : uploadedKeys.exteriorImages,
        businessInteriorImage:
          businessType === "Online" ? [] : uploadedKeys.interiorImages,
        businessProductImage: uploadedKeys.productImages,
        establishedDate: date ? new Date(date) : undefined,
      };

      const response = await axios.post(
        "/api/add-business-details/67fcc776b7e74231eba1e45a",
        formData
      );

      if (response.status === 200) {
        alert("✅ Business Created Successfully!");
        // Optionally reset form or redirect here
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("❌ Failed to submit form!");
    }
  };

  const establishedDate = date ? new Date(date) : undefined;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-[1024px] mx-auto flex flex-col items-center gap-12 py-12"
    >
      <div className="w-full max-w-[768px] flex flex-col gap-1">
        <h1
          className={`${inter.className} text-[#fafafa] text-[30px] font-bold`}
        >
          Set up your business profile
        </h1>
        <p className={`${inter.className} text-[#a1a1aa] text-[16px]`}>
          Tell us about your business so we can provide personalized AI insights
        </p>
      </div>

      {/* Basic Information Section */}
      <div
        className={`w-full max-w-[768px] rounded-lg px-5 shadow-gray-900 backdrop-blur-sm py-4 pb-10 ${borderColor.OnePx}`}
      >
        <div>
          <p
            className={`${inter.className} text-[#fafafa] font-semibold text-[24px]`}
          >
            Basic Information
          </p>
          <p className={`${inter.className} text-[#a1a1aa] text-[14px]`}>
            Enter the core details about your business
          </p>
        </div>
        <div className="w-full flex flex-col gap-4 mt-7">
          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Business Name*
            </p>
            <input
              type="text"
              {...form.register("businessName")}
              placeholder="e.g. John&apos;s Coffee Shop"
              className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                borderColor.OnePx
              } ${
                inter.className
              } placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                form.formState.errors.businessName ? "border-red-500" : ""
              }`}
            />
            {form.formState.errors.businessName && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.businessName.message}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} text-[#fafafa] text-[14px] font-semibold`}
            >
              Business Type*
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    {...form.register("businessType")}
                    value="Offline"
                    className="peer hidden"
                  />
                  <div className="w-[16px] h-[16px] rounded-full border-2 border-[#a855f7] peer-checked:bg-[#a855f7] peer-checked:ring-2 peer-checked:ring-[#a855f7] transition-all duration-200"></div>
                </label>
                <span
                  className={`${inter.className} font-semibold text-[#fafafa] text-[14px]`}
                >
                  Offline (Physical location only)
                </span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    {...form.register("businessType")}
                    value="Online"
                    className="peer hidden"
                  />
                  <div className="w-[16px] h-[16px] rounded-full border-2 border-[#a855f7] peer-checked:bg-[#a855f7] peer-checked:ring-2 peer-checked:ring-[#a855f7] transition-all duration-200"></div>
                </label>
                <span
                  className={`${inter.className} font-semibold text-[#fafafa] text-[14px]`}
                >
                  Online (Web presence only)
                </span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    {...form.register("businessType")}
                    value="Both"
                    className="peer hidden"
                  />
                  <div className="w-[16px] h-[16px] rounded-full border-2 border-[#a855f7] peer-checked:bg-[#a855f7] peer-checked:ring-2 peer-checked:ring-[#a855f7] transition-all duration-200"></div>
                </label>
                <span
                  className={`${inter.className} font-semibold text-[#fafafa] text-[14px]`}
                >
                  Both (Physical location and web presence)
                </span>
              </label>
            </div>
            {form.formState.errors.businessType && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.businessType.message}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-1">
            <p
              className={`text-[#fafafa] ${inter.className} text-[14px] font-semibold`}
            >
              Business Description*
            </p>
            <textarea
              {...form.register("businessDescription")}
              placeholder="Describe what your business does, your product/services, and your target customers"
              className={`w-full min-h-[110px] ${
                inter.className
              } text-[14px] bg-transparent rounded-md ${
                borderColor.OnePx
              } placeholder:text-[#a1a1aa] px-3 py-2 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                form.formState.errors.businessDescription
                  ? "border-red-500"
                  : ""
              }`}
            />
            {form.formState.errors.businessDescription && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.businessDescription.message}
              </p>
            )}
          </div>

          {(businessType === "Offline" || businessType === "Both") && (
            <>
              <div className="w-full flex flex-col gap-1">
                <p
                  className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
                >
                  Business Address*
                </p>
                <input
                  type="text"
                  {...form.register("businessAddress")}
                  placeholder="Enter your business address"
                  className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                    borderColor.OnePx
                  } ${
                    inter.className
                  } placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                    form.formState.errors.businessAddress
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {form.formState.errors.businessAddress && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.businessAddress.message}
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col gap-1">
                <p
                  className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
                >
                  City*
                </p>
                <input
                  type="text"
                  {...form.register("businessCity")}
                  placeholder="Enter your business city"
                  className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                    borderColor.OnePx
                  } ${
                    inter.className
                  } placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                    form.formState.errors.businessCity ? "border-red-500" : ""
                  }`}
                />
                {form.formState.errors.businessCity && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.businessCity.message}
                  </p>
                )}
                <p className={`${inter.className} text-[12px] text-[#a1a1aa]`}>
                  We&apos;ll use this to analyze nearby competitors and local market
                  trends
                </p>
              </div>
            </>
          )}

          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Established Date*
            </p>
            <div className="text-white">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      `w-full h-[45px] bg-transparent rounded-md text-[14px] ${borderColor.OnePx} ${inter.className} placeholder:text-[#a1a1aa] px-3 text-left font-normal flex justify-between items-center`,
                      !date && "text-[#a1a1aa]"
                    )}
                  >
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-[#a1a1aa]" />
                      {date ? (
                        format(new Date(date), "PPP")
                      ) : (
                        <span className="text-[#a1a1aa]">
                          Select establishment date
                        </span>
                      )}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-[#1c1c1c] border border-[#27272a]"
                  align="start"
                >
                  <CalendarComponent
                    mode="single"
                    selected={establishedDate}
                    onSelect={(selectedDate) =>
                      dispatch(
                        businessSetupFormAction.setDate({
                          data: selectedDate
                            ? selectedDate.toISOString()
                            : undefined,
                        })
                      )
                    }
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="bg-[#1c1c1c] text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            {form.formState.errors.establishedDate && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.establishedDate.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Business Images Section */}
      <div
        className={`w-full max-w-[768px] rounded-lg px-5 shadow-gray-900 backdrop-blur-sm py-4 pb-10 ${borderColor.OnePx}`}
      >
        <div>
          <p
            className={`${inter.className} text-[24px] font-bold text-[#fafafa]`}
          >
            Business Images
          </p>
          <p className={`${inter.className} text-[14px] text-[#a1a1aa]`}>
            Upload photos of your business for AI analysis (max 3 per category)
          </p>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Exterior Images - Only show for Offline or Both */}
          {(businessType === "Offline" || businessType === "Both") && (
            <div
              className={`w-full h-auto min-h-[210px] rounded-md flex flex-col items-center justify-center ${borderColor.OnePx} border-dashed p-4`}
            >
              <div className="flex flex-col gap-1 items-center">
                <div className="text-[#a1a1aa]">
                  <Building size={40} />
                </div>
                <p
                  className={`${inter.className} font-semibold text-[#fafafa] text-[16px]`}
                >
                  Exterior*
                </p>
                <p
                  className={`${inter.className} text-[#a1a1aa] text-[12px] w-[179px] text-center`}
                >
                  Upload photos of your storefront
                </p>
              </div>

              {exteriorFiles.length > 0 && (
                <div className="w-full mt-3 space-y-2">
                  {exteriorFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#27272a] p-2 rounded"
                    >
                      <span
                        className={`${inter.className} text-[#fafafa] text-[12px] truncate max-w-[150px]`}
                      >
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          removeFile(index, exteriorFiles, setExteriorFiles)
                        }
                        className="h-6 w-6 p-0 text-[#a1a1aa] hover:text-[#fafafa]"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="file"
                  id="exterior"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setExteriorFiles(
                      Array.from(e.target.files || []).slice(0, 3)
                    )
                  }
                />
                <label
                  htmlFor="exterior"
                  className={`cursor-pointer w-[98px] h-[36px] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#49484b] transition ${borderColor.OnePx} flex items-center justify-center gap-1.5`}
                >
                  <div className="text-[#fafafa]">
                    <Upload size={17} />
                  </div>
                  <p className={`${inter.className} text-[14px]`}>Upload</p>
                </label>
              </div>
              <p
                className={`${inter.className} text-[12px] text-[#a1a1aa] mt-1 text-center`}
              >
                {exteriorFiles.length}/3 images
              </p>
              {exteriorFiles.length === 0 && (
                <p className="text-[#fafafa] text-sm mt-1">
                  Exterior images are required
                </p>
              )}
            </div>
          )}

          {/* Interior Images - Only show for Offline or Both */}
          {(businessType === "Offline" || businessType === "Both") && (
            <div
              className={`w-full h-auto min-h-[210px] rounded-md flex flex-col items-center justify-center ${borderColor.OnePx} border-dashed p-4 `}
            >
              <div className="flex flex-col gap-1 items-center">
                <div className="text-[#a1a1aa]">
                  <ImagePlus size={40} />
                </div>
                <p
                  className={`${inter.className} font-semibold text-[#fafafa] text-[16px]`}
                >
                  Interior*
                </p>
                <p
                  className={`${inter.className} text-[#a1a1aa] text-[12px] w-[179px] text-center`}
                >
                  Upload photos of your store interior
                </p>
              </div>

              {interiorFiles.length > 0 && (
                <div className="w-full mt-3 space-y-2">
                  {interiorFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#27272a] p-2 rounded"
                    >
                      <span
                        className={`${inter.className} text-[#fafafa] text-[12px] truncate max-w-[150px]`}
                      >
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          removeFile(index, interiorFiles, setInteriorFiles)
                        }
                        className="h-6 w-6 p-0 text-[#a1a1aa] hover:text-[#fafafa]"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="file"
                  id="interior"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setInteriorFiles(
                      Array.from(e.target.files || []).slice(0, 3)
                    )
                  }
                />
                <label
                  htmlFor="interior"
                  className={`cursor-pointer w-[98px] h-[36px] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#49484b] transition ${borderColor.OnePx} flex items-center justify-center gap-1.5`}
                >
                  <div className="text-[#fafafa]">
                    <Upload size={17} />
                  </div>
                  <p className={`${inter.className} text-[14px]`}>Upload</p>
                </label>
              </div>
              <p
                className={`${inter.className} text-[12px] text-[#a1a1aa] mt-1 text-center`}
              >
                {interiorFiles.length}/3 images
              </p>
              {interiorFiles.length === 0 && (
                <p className="text-[#fafafa] text-sm mt-1">
                  Interior images are required
                </p>
              )}
            </div>
          )}

          {/* Product Images - Show for all business types */}
          <div
            className={`w-full h-auto min-h-[210px] rounded-md flex flex-col items-center justify-center ${
              borderColor.OnePx
            } border-dashed p-4  ${
              businessType === "Online" ? "md:col-span-3" : ""
            }`}
          >
            <div className="flex flex-col gap-1 items-center">
              <div className="text-[#a1a1aa]">
                <ImagePlus size={40} />
              </div>
              <p
                className={`${inter.className} font-semibold text-[#fafafa] text-[16px]`}
              >
                Products*
              </p>
              <p
                className={`${inter.className} text-[#a1a1aa] text-[12px] w-[179px] text-center`}
              >
                Upload photos of your products
              </p>
            </div>

            {productImages.length > 0 && (
              <div className="w-full mt-3 space-y-2">
                {productImages.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#27272a] p-2 rounded"
                  >
                    <span
                      className={`${inter.className} text-[#fafafa] text-[12px] truncate max-w-[150px]`}
                    >
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        removeFile(index, productImages, setProductImages)
                      }
                      className="h-6 w-6 p-0 text-[#a1a1aa] hover:text-[#fafafa]"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <input
                type="file"
                id="products"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setProductImages(Array.from(e.target.files || []).slice(0, 3))
                }
              />
              <label
                htmlFor="products"
                className={`cursor-pointer w-[98px] h-[36px] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#49484b] transition ${borderColor.OnePx} flex items-center justify-center gap-1.5`}
              >
                <div className="text-[#fafafa]">
                  <Upload size={17} />
                </div>
                <p className={`${inter.className} text-[14px]`}>Upload</p>
              </label>
            </div>
            <p
              className={`${inter.className} text-[12px] text-[#a1a1aa] mt-1 text-center`}
            >
              {productImages.length}/3 images
            </p>
            {productImages.length === 0 && (
              <p className="text-[#fafafa] text-sm mt-1">
                Product images are required
              </p>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-1 mt-6">
          <p
            className={`text-[#fafafa] ${inter.className} text-[14px] font-semibold`}
          >
            Product Description*
          </p>
          <textarea
            {...form.register("businessProductDescription")}
            placeholder="Describe your main products or services"
            className={`w-full min-h-[110px] ${
              inter.className
            } text-[14px] bg-transparent rounded-md ${
              borderColor.OnePx
            } placeholder:text-[#a1a1aa] px-3 py-2 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
              form.formState.errors.businessProductDescription
                ? "border-red-500"
                : ""
            }`}
          />
          {form.formState.errors.businessProductDescription && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.businessProductDescription.message}
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div
        className={`w-full max-w-[768px] rounded-lg px-5 shadow-gray-900 backdrop-blur-sm py-4 pb-10 ${borderColor.OnePx}`}
      >
        <div>
          <p
            className={`${inter.className} text-[#fafafa] font-semibold text-[24px]`}
          >
            Contact Information
          </p>
          <p className={`${inter.className} text-[#a1a1aa] text-[14px]`}>
            How customers can reach your business
          </p>
        </div>
        <div className="w-full flex flex-col gap-4 mt-7">
          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Business Email*
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                <Mail size={18} />
              </div>
              <input
                type="email"
                {...form.register("businessEmail")}
                placeholder="contact@yourbusiness.com"
                className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                  borderColor.OnePx
                } ${
                  inter.className
                } placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                  form.formState.errors.businessEmail ? "border-red-500" : ""
                }`}
              />
            </div>
            {form.formState.errors.businessEmail && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.businessEmail.message}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Business Phone*
            </p>
            <div className="flex gap-2">
              <Controller
                name="businessPhone.countryCode"
                control={form.control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-[120px] h-[45px] bg-transparent rounded-md text-[14px] ${borderColor.OnePx} ${inter.className} text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] px-2`}
                    onChange={(e) => {
                      field.onChange(e);
                      dispatch(
                        businessSetupFormAction.setSelectedCountryCode({
                          data: e.target.value,
                        })
                      );
                    }}
                  >
                    {countryCodes.map((country) => (
                      <option
                        key={country.code + country.country}
                        value={country.code}
                        className="bg-[#1c1c1c]"
                      >
                        {country.code} {country.country}
                      </option>
                    ))}
                  </select>
                )}
              />
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  {...form.register("businessPhone.number")}
                  placeholder="(555) 123-4567"
                  className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                    borderColor.OnePx
                  } ${
                    inter.className
                  } placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                    form.formState.errors.businessPhone?.number
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>
            </div>
            {form.formState.errors.businessPhone?.number && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.businessPhone.number.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Online Presence Section - Only show for Online or Both */}
      {(businessType === "Online" || businessType === "Both") && (
        <div
          className={`w-full max-w-[768px] rounded-lg px-5 shadow-gray-900 backdrop-blur-sm py-4 pb-10 ${borderColor.OnePx}`}
        >
          <div>
            <p
              className={`${inter.className} text-[#fafafa] font-semibold text-[24px]`}
            >
              Online Presence
            </p>
            <p className={`${inter.className} text-[#a1a1aa] text-[14px]`}>
              Add your website and social media links
            </p>
          </div>
          <div>
            <div className="w-full flex flex-col gap-4 mt-7">
              <div className="w-full flex flex-col gap-1">
                <p
                  className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
                >
                  Website URL*
                </p>
                <input
                  type="text"
                  {...form.register("businessWebsite")}
                  placeholder="https://yourbusiness.com"
                  className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                    borderColor.OnePx
                  } ${
                    inter.className
                  } placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                    form.formState.errors.businessWebsite
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {form.formState.errors.businessWebsite && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.businessWebsite.message}
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col gap-1">
                <p
                  className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
                >
                  Instagram*
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                    <Instagram size={18} />
                  </div>
                  <input
                    type="text"
                    {...form.register("businessSocialMedia.businessInstagram", {
                      required:
                        businessType === "Online" || businessType === "Both"
                          ? "Instagram is required"
                          : false,
                    })}
                    placeholder="@yourbusiness"
                    className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                      borderColor.OnePx
                    } ${
                      inter.className
                    } placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                      form.formState.errors.businessSocialMedia
                        ?.businessInstagram
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {form.formState.errors.businessSocialMedia
                  ?.businessInstagram && (
                  <p className="text-red-500 text-sm">
                    {
                      form.formState.errors.businessSocialMedia
                        .businessInstagram.message
                    }
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col gap-1">
                <p
                  className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
                >
                  Facebook*
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                    <Facebook size={18} />
                  </div>
                  <input
                    type="text"
                    {...form.register("businessSocialMedia.businessFacebook", {
                      required:
                        businessType === "Online" || businessType === "Both"
                          ? "Facebook is required"
                          : false,
                    })}
                    placeholder="facebook.com/yourbusiness"
                    className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                      borderColor.OnePx
                    } ${
                      inter.className
                    } placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                      form.formState.errors.businessSocialMedia
                        ?.businessFacebook
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {form.formState.errors.businessSocialMedia
                  ?.businessFacebook && (
                  <p className="text-red-500 text-sm">
                    {
                      form.formState.errors.businessSocialMedia.businessFacebook
                        .message
                    }
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col gap-1">
                <p
                  className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
                >
                  Twitter*
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                    <Twitter size={18} />
                  </div>
                  <input
                    type="text"
                    {...form.register("businessSocialMedia.businessTwitter", {
                      required:
                        businessType === "Online" || businessType === "Both"
                          ? "Twitter is required"
                          : false,
                    })}
                    placeholder="@yourbusiness"
                    className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                      borderColor.OnePx
                    } ${
                      inter.className
                    } placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                      form.formState.errors.businessSocialMedia?.businessTwitter
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {form.formState.errors.businessSocialMedia?.businessTwitter && (
                  <p className="text-red-500 text-sm">
                    {
                      form.formState.errors.businessSocialMedia.businessTwitter
                        .message
                    }
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col gap-1">
                <p
                  className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
                >
                  LinkedIn*
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                    <Linkedin size={18} />
                  </div>
                  <input
                    type="text"
                    {...form.register("businessSocialMedia.businessLinkedin", {
                      required:
                        businessType === "Online" || businessType === "Both"
                          ? "LinkedIn is required"
                          : false,
                    })}
                    placeholder="linkedin.com/company/yourbusiness"
                    className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                      borderColor.OnePx
                    } ${
                      inter.className
                    } placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                      form.formState.errors.businessSocialMedia
                        ?.businessLinkedin
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {form.formState.errors.businessSocialMedia
                  ?.businessLinkedin && (
                  <p className="text-red-500 text-sm">
                    {
                      form.formState.errors.businessSocialMedia.businessLinkedin
                        .message
                    }
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col gap-1">
                <p
                  className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
                >
                  YouTube*
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                    <Youtube size={18} />
                  </div>
                  <input
                    type="text"
                    {...form.register("businessSocialMedia.businessYoutube", {
                      required:
                        businessType === "Online" || businessType === "Both"
                          ? "YouTube is required"
                          : false,
                    })}
                    placeholder="youtube.com/@yourbusiness"
                    className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                      borderColor.OnePx
                    } ${
                      inter.className
                    } placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                      form.formState.errors.businessSocialMedia?.businessYoutube
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {form.formState.errors.businessSocialMedia?.businessYoutube && (
                  <p className="text-red-500 text-sm">
                    {
                      form.formState.errors.businessSocialMedia.businessYoutube
                        .message
                    }
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col gap-1">
                <p
                  className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
                >
                  Pinterest*
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                    <Pinterest size={18} />
                  </div>
                  <input
                    type="text"
                    {...form.register("businessSocialMedia.businessPinterest", {
                      required:
                        businessType === "Online" || businessType === "Both"
                          ? "Pinterest is required"
                          : false,
                    })}
                    placeholder="pinterest.com/yourbusiness"
                    className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                      borderColor.OnePx
                    } ${
                      inter.className
                    } placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                      form.formState.errors.businessSocialMedia
                        ?.businessPinterest
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {form.formState.errors.businessSocialMedia
                  ?.businessPinterest && (
                  <p className="text-red-500 text-sm">
                    {
                      form.formState.errors.businessSocialMedia
                        .businessPinterest.message
                    }
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col gap-1">
                <p
                  className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
                >
                  Google Business Profile*
                </p>
                <input
                  type="text"
                  {...form.register("googleBusinessProfile", {
                    required:
                      businessType === "Online" || businessType === "Both"
                        ? "Google Business Profile is required"
                        : false,
                  })}
                  placeholder="Google Maps link to your business"
                  className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                    borderColor.OnePx
                  } ${
                    inter.className
                  } placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                    form.formState.errors.googleBusinessProfile
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {form.formState.errors.googleBusinessProfile && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.googleBusinessProfile.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Details Section */}
      <div
        className={`w-full max-w-[768px] rounded-lg px-5 shadow-gray-900 backdrop-blur-sm py-4 pb-10 ${borderColor.OnePx}`}
      >
        <div>
          <p
            className={`${inter.className} text-[#fafafa] font-semibold text-[24px]`}
          >
            Business Details
          </p>
          <p className={`${inter.className} text-[#a1a1aa] text-[14px]`}>
            Additional information about your business operations
          </p>
        </div>
        <div className="w-full flex flex-col gap-4 mt-7">
          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Business Categories*
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {businessCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center bg-[#27272a] px-3 py-1 rounded-full"
                >
                  <span
                    className={`${inter.className} text-[#fafafa] text-[12px]`}
                  >
                    {category}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="ml-2 text-[#a1a1aa] hover:text-[#fafafa]"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                <Tag size={18} />
              </div>
              <input
                type="text"
                placeholder="Add a category (e.g., Restaurant, Retail) and press Enter"
                onKeyDown={handleCategoryChange}
                className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${borderColor.OnePx} ${inter.className} placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
              />
            </div>
            <p className={`${inter.className} text-[12px] text-[#a1a1aa] mt-1`}>
              Press Enter after each category to add it to the list
            </p>
            {businessCategories.length === 0 && (
              <p className="text-[#fafafa] text-sm">
                At least one business category is required
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Business Tags*
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {businessTags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-[#27272a] px-3 py-1 rounded-full"
                >
                  <span
                    className={`${inter.className} text-[#fafafa] text-[12px]`}
                  >
                    {tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-[#a1a1aa] hover:text-[#fafafa]"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                <Tag size={18} />
              </div>
              <input
                type="text"
                placeholder="Add a tag (e.g., Vegan, Family-friendly) and press Enter"
                onKeyDown={handleTagChange}
                className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${borderColor.OnePx} ${inter.className} placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
              />
            </div>
            <p className={`${inter.className} text-[12px] text-[#a1a1aa] mt-1`}>
              Press Enter after each tag to add it to the list
            </p>
            {businessTags.length === 0 && (
              <p className="text-[#fafafa] text-sm">
                At least one business tag is required
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Operating Hours*
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                <Clock size={18} />
              </div>
              <input
                type="text"
                {...form.register("operatingHours", {
                  required: "Operating hours are required",
                })}
                placeholder="e.g., Mon-Fri: 9AM-5PM, Sat: 10AM-3PM, Sun: Closed"
                className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                  borderColor.OnePx
                } ${
                  inter.className
                } placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                  form.formState.errors.operatingHours ? "border-red-500" : ""
                }`}
              />
              {form.formState.errors.operatingHours && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.operatingHours.message}
                </p>
              )}
            </div>
          </div>

          {/* Amenities - Only show for Offline or Both */}
          {(businessType === "Offline" || businessType === "Both") && (
            <div className="w-full flex flex-col gap-1">
              <p
                className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
              >
                Amenities*
              </p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                  <Coffee size={18} />
                </div>
                <input
                  type="text"
                  {...form.register("Ameneities", {
                    required:
                      businessType === "Offline" || businessType === "Both"
                        ? "Amenities are required"
                        : false,
                  })}
                  placeholder="e.g., WiFi, Parking, Wheelchair Access"
                  className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                    borderColor.OnePx
                  } ${
                    inter.className
                  } placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                    form.formState.errors.Ameneities ? "border-red-500" : ""
                  }`}
                />
                {form.formState.errors.Ameneities && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.Ameneities.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Online Ordering Platforms - Only show for Online or Both */}
          {(businessType === "Online" || businessType === "Both") && (
            <div className="w-full flex flex-col gap-1">
              <p
                className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
              >
                Online Ordering Platforms*
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {orderingPlatforms.map((platform, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-[#27272a] px-3 py-1 rounded-full"
                  >
                    <span
                      className={`${inter.className} text-[#fafafa] text-[12px]`}
                    >
                      {platform}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePlatform(platform)}
                      className="ml-2 text-[#a1a1aa] hover:text-[#fafafa]"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                  <ShoppingBag size={18} />
                </div>
                <input
                  type="text"
                  placeholder="e.g., UberEats, DoorDash, GrubHub"
                  onKeyDown={handlePlatformChange}
                  className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${borderColor.OnePx} ${inter.className} placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] 
                    `}
                />
              </div>
              <p
                className={`${inter.className} text-[12px] text-[#a1a1aa] mt-1`}
              >
                Press Enter after each platform to add it to the list
              </p>
              {(businessType === "Online" || businessType === "Both") &&
                orderingPlatforms.length === 0 && (
                  <p className="text-[#fafafa] text-sm">
                    At least one online ordering platform is required
                  </p>
                )}
            </div>
          )}

          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Revenue Range*
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#a1a1aa]">
                <DollarSign size={18} />
              </div>
              <select
                {...form.register("revenue", {
                  required: "Revenue range is required",
                })}
                className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${
                  borderColor.OnePx
                } ${
                  inter.className
                } placeholder:text-[#a1a1aa] pl-10 pr-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] ${
                  form.formState.errors.revenue ? "border-red-500" : ""
                }`}
              >
                <option value="" className="bg-[#121212]">
                  Select revenue range
                </option>
                <option value="Less than $50,000" className="bg-[#121212]">
                  Less than $50,000
                </option>
                <option value="$50,000 - $100,000" className="bg-[#121212]">
                  $50,000 - $100,000
                </option>
                <option value="$100,000 - $500,000" className="bg-[#121212]">
                  $100,000 - $500,000
                </option>
                <option value="$500,000 - $1 million" className="bg-[#121212]">
                  $500,000 - $1 million
                </option>
                <option
                  value="$1 million - $5 million"
                  className="bg-[#121212]"
                >
                  $1 million - $5 million
                </option>
                <option value="More than $5 million" className="bg-[#121212]">
                  More than $5 million
                </option>
              </select>
              {form.formState.errors.revenue && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.revenue.message}
                </p>
              )}
            </div>
            <p className={`${inter.className} text-[12px] text-[#a1a1aa] mt-1`}>
              This helps us tailor our AI insights to businesses of your size
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="w-full max-w-[768px] flex justify-end mt-4">
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={`bg-[#6D28D9] hover:bg-[#5b21b6] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
            form.formState.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Business Profile"}
        </button>
      </div>
    </form>
  );
};

export default BusinessSetupForm;
