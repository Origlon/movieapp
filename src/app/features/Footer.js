import { HeaderLogo } from "../icon/Headerlogo";
import { Maillogo } from "../icon/Maillogo";
import { Phonelogo } from "../icon/Phonelogo";
export const Footer = () => {
  return (
    <div className="w-full  bg-[#4338CA] px-20 py-10 justify-center flex">
      <div className="w-7xl flex justify-between max-sm:px-4 max-sm:p-4.5 max-sm:gap-7 max-sm:flex-col">
        <div className="w-61.75 h-13 flex gap-1 flex-col ">
          <div className="flex  flex-col md:flex items-start max-sm:gap-2">
            <div className="flex items-center gap-1 ">
              <HeaderLogo color="white" width={20} height={20} />

              <div className="text-white text-base font-bold  flex justify-center items-center">
                MovieZ
              </div>
            </div>
            <div className="flex text-[#fafafa] text-sm font-normal ">
              © 2024 Movie Z. All Rights Reserved.
            </div>
          </div>
        </div>
        <div className="flex gap-24 ">
          <div className="flex gap-5 flex-col">
            <div className="text-base font-norwal text-[#fafafa]">
              Contact Information
            </div>
            <div className="flex flex-col gap-5">
              <div className="h-10 flex items-center gap-x-3">
                <Maillogo width={16} height={16} color="white" />
                <div className="flex flex-col text-base font-norwal text-[#fafafa] ">
                  <div>Email:</div>
                  <div>support@movieZ.com</div>
                </div>
              </div>
              <div className="h-10 flex items-center gap-x-3 ">
                <Phonelogo width={16} height={16} color="white" />
                <div className="flex flex-col text-base font-norwal text-[#fafafa]">
                  <div>Phone:</div>
                  <div>+976 (11) 123-4567</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-col max-sm:flex-col">
            <div className="text-base font-medium text-[#fafafa]">
              Follow us
            </div>
            <div className="flex text-base font-medium flex-row gap-3 text-[#fafafa] max-sm:flex-col">
              <div>Facebook</div>
              <div>Instegram</div>
              <div>Twitter</div>
              <div>YouTube</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
