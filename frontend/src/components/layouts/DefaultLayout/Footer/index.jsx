import { grabLogo, momoLogo } from "@/assets/logo";


function Footer() {
  return (
    <div className="mx-6 py-10 text-center md:text-left">
      <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* <!-- TW Elements section --> */}
        <div className="">
          <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-3 h-4 w-4"
            >
              <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
            </svg>
            Công ty cổ phần Con Yêu
          </h6>
          <p>
            Chuỗi cửa hàng sữa cho mẹ bầu và em bé lớn nhất Việt Nam, có nhiều
            chi nhánh trải khắp 63 tỉnh thành Việt Nam. Tự hào là nguồn sữa
            chính hãng, nguồn gốc xuất xứ rõ ràng, đảm bảo sức khỏe cho mẹ bầu
            và em bé.
          </p>
        </div>
        {/* <!-- Products section --> */}
        <div className="">
          <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
            Hỗ trợ khách hàng
          </h6>
          <p className="mb-4">
            <a className="text-neutral-600 dark:text-neutral-200">
              Giới thiệu về Con Yêu
            </a>
          </p>
          <p className="mb-4">
            <a className="text-neutral-600 dark:text-neutral-200">
              Mua & giao nhận Online
            </a>
          </p>
          <p className="mb-4">
            <a className="text-neutral-600 dark:text-neutral-200">
              Đổi trả & Hoàn tiền
            </a>
          </p>
        </div>
        {/* <!-- Useful links section --> */}
        <div className="">
          <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
            Chấp nhận thanh toán
          </h6>

          <p className="mb-4">
            <img
              className="text-neutral-600 dark:text-neutral-200 w-10"
              src={momoLogo}
            />
          </p>
        </div>
        {/* <!-- Contact section --> */}
        <div>
          <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
            Contact
          </h6>
          <p className="mb-4 flex items-center justify-center md:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-3 h-5 w-5"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
            FPT UNIVERSITY, TP HCM, VN
          </p>
          <p className="mb-4 flex items-center justify-center md:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-3 h-5 w-5"
            >
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
            conyeu@gmail.com
          </p>
          <p className="mb-4 flex items-center justify-center md:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-3 h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                clipRule="evenodd"
              />
            </svg>
            + 01 234 567 89
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
