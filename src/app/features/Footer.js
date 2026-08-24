import { HeaderLogo } from "../icon/Headerlogo";
import { Maillogo } from "../icon/Maillogo";
import { Phonelogo } from "../icon/Phonelogo";

export const Footer = () => {
  return (
    <div className="w-full bg-[#4338CA]">
      <div className="mx-auto flex w-full max-w-7xl justify-between px-4 py-10">
        <div className="flex h-13 w-61.75 flex-col gap-1">
          <div className="flex flex-col items-start max-sm:gap-2">
            <div className="flex items-center gap-1">
              <HeaderLogo color="white" width={20} height={20} />

              <div className="flex items-center justify-center text-base font-bold text-white">
                MovieZ
              </div>
            </div>

            <div className="text-sm font-normal text-[#fafafa] pt-4">
              © 2024 Movie Z. All Rights Reserved.
            </div>
          </div>
        </div>

        <div className="flex gap-24 max-sm:flex-col max-sm:gap-7">
          <div className="flex flex-col gap-5">
            <div className="text-base font-normal text-[#fafafa]">
              Contact Information
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex h-10 items-center gap-x-3">
                <Maillogo width={16} height={16} color="white" />

                <div className="flex flex-col text-base font-normal text-[#fafafa]">
                  <div>Email:</div>
                  <div>support@movieZ.com</div>
                </div>
              </div>

              <div className="flex h-10 items-center gap-x-3">
                <Phonelogo width={16} height={16} color="white" />

                <div className="flex flex-col text-base font-normal text-[#fafafa]">
                  <div>Phone:</div>
                  <div>+976 (11) 123-4567</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-base font-medium text-[#fafafa]">
              Follow us
            </div>

            <div className="flex flex-row gap-3 text-base font-medium text-[#fafafa] max-sm:flex-col">
              <div>Facebook</div>
              <div>Instagram</div>
              <div>Twitter</div>
              <div>YouTube</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
