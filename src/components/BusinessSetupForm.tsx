import { borderColor } from "@/constants/colors";
import { inter } from "@/constants/fonts";
import { Building, ImagePlus, Upload } from "lucide-react";

const BusinessSetupForm = () => {
  return (
    <form className="w-screen min-h-screen  flex flex-col items-center gap-12 py-12">
      <div className="w-[768px] flex flex-col gap-1">
        <h1
          className={`${inter.className} text-[#fafafa] text-[30px] font-bold`}
        >
          Set up your business profile
        </h1>
        <p className={`${inter.className} text-[#a1a1aa] text-[16px]`}>
          Tell us about your business so we can provide personalized AI insights
        </p>
      </div>

      <div
        className={`w-[768px] rounded-lg  px-5  shadow-gray-900 backdrop-blur-sm py-4 pb-10 ${borderColor.OnePx} `}
      >
        <div>
          <p
            className={`${inter.className} text-[#fafafa] font-semibold text-[24px]`}
          >
            Basic Information
          </p>
          <p className={`${inter.className} text-[#a1a1aa]  text-[14px]`}>
            Enter the core details about your business
          </p>
        </div>
        <div className="w-full flex flex-col gap-4 mt-7">
          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Business Name
            </p>
            <input
              type="text"
              placeholder="e.g. John's Coffee Shop"
              className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${borderColor.OnePx} ${inter.className} placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
            />
          </div>

          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} text-[#fafafa] text-[14px] font-semibold`}
            >
              Business Type
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="customRadio"
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
                    name="customRadio"
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
                    name="customRadio"
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
          </div>

          <div className="w-full flex flex-col gap-1">
            <p className={`text-[#fafafa] ${inter.className} text-[14px]`}>
              Business Description
            </p>
            <textarea
              name="description"
              placeholder="Describe what your business does, your product/services, and your target customers"
              id="description"
              className={`w-full min-h-[110px] ${inter.className} text-[14px] bg-transparent rounded-md ${borderColor.OnePx} placeholder:text-[#a1a1aa] px-3 py-2 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Business Location
            </p>
            <input
              type="text"
              placeholder="Enter your business address"
              className={`w-full h-[45px] bg-transparent rounded-md text-[14px] ${borderColor.OnePx} ${inter.className} placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
            />
            <p className={`${inter.className} text-[12px] text-[#a1a1aa]`}>
              We'll use this to analyze nearby competitors and local market
              trends
            </p>
          </div>
        </div>
      </div>
      <div
        className={`w-[768px] rounded-lg  px-5  shadow-gray-900 backdrop-blur-sm py-4 pb-10 ${borderColor.OnePx} `}
      >
        <div>
          <p
            className={`${inter.className} text-[24px] font-bold text-[#fafafa]`}
          >
            Business Images
          </p>
          <p className={`${inter.className} text-[14px] text-[#a1a1aa]`}>
            Upload photos of your business for AI analysis
          </p>
        </div>
        <div className="w-full flex  justify-between items-center mt-5">
          <div
            className={`w-[230px] h-[210px] rounded-md  flex flex-col items-center justify-center ${borderColor.OnePx} border-dashed`}
          >
            <div className="flex flex-col gap-1 items-center">
              <div className="text-[#a1a1aa] ">
                <Building size={40} />
              </div>
              <p
                className={`${inter.className} font-semibold text-[#fafafa] text-[16px]`}
              >
                Exterior
              </p>
              <p
                className={`${inter.className} text-[#a1a1aa] text-[12px] w-[179px] text-center`}
              >
                Upload photos of your storefront
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="file"
                name="exterior"
                id="exterior"
                className="hidden"
              />
              <label
                htmlFor="exterior"
                className={`cursor-pointer w-[98px] h-[36px] text-white px-4 py-2 rounded-md  text-sm font-medium hover:bg-[#49484b] transition ${borderColor.OnePx} flex items-center justify-center gap-1.5`}
              >
                <div className="text-[#fafafa]">
                  <Upload size={17} />
                </div>
                <p className={`${inter.className} text-[14px]`}>Upload</p>
              </label>
            </div>{" "}
          </div>
          <div
            className={`w-[230px] h-[210px] rounded-md  flex flex-col items-center justify-center ${borderColor.OnePx} border-dashed`}
          >
            <div className="flex flex-col gap-1 items-center">
              <div className="text-[#a1a1aa] ">
                <ImagePlus size={40} />
              </div>
              <p
                className={`${inter.className} font-semibold text-[#fafafa] text-[16px]`}
              >
                Interior
              </p>
              <p
                className={`${inter.className} text-[#a1a1aa] text-[12px] w-[179px] text-center`}
              >
                Upload photos of your store interior
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="file"
                name="exterior"
                id="exterior"
                className="hidden"
              />
              <label
                htmlFor="exterior"
                className={`cursor-pointer w-[98px] h-[36px] text-white px-4 py-2 rounded-md  text-sm font-medium hover:bg-[#49484b] transition ${borderColor.OnePx} flex items-center justify-center gap-1.5`}
              >
                <div className="text-[#fafafa]">
                  <Upload size={17} />
                </div>
                <p className={`${inter.className} text-[14px]`}>Upload</p>
              </label>
            </div>{" "}
          </div>
          <div
            className={`w-[230px] h-[210px] rounded-md  flex flex-col items-center justify-center ${borderColor.OnePx} border-dashed`}
          >
            <div className="flex flex-col gap-1 items-center">
              <div className="text-[#a1a1aa] ">
                <ImagePlus size={40} />
              </div>
              <p
                className={`${inter.className} font-semibold text-[#fafafa] text-[16px]`}
              >
                Products
              </p>
              <p
                className={`${inter.className} text-[#a1a1aa] text-[12px] w-[179px] text-center`}
              >
                Upload photos of your products
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="file"
                name="exterior"
                id="exterior"
                className="hidden"
              />
              <label
                htmlFor="exterior"
                className={`cursor-pointer w-[98px] h-[36px] text-white px-4 py-2 rounded-md  text-sm font-medium hover:bg-[#49484b] transition ${borderColor.OnePx} flex items-center justify-center gap-1.5`}
              >
                <div className="text-[#fafafa]">
                  <Upload size={17} />
                </div>
                <p className={`${inter.className} text-[14px]`}>Upload</p>
              </label>
            </div>{" "}
          </div>
        </div>
      </div>
    </form>
  );
};

export default BusinessSetupForm;
