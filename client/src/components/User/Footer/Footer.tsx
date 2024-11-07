import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary py-10 min-h-[255px] relative">
      <section className="container-main mx-auto grid grid-cols-12 gap-5 md:gap-10 text-util">
        <div className="col-span-11 md:col-span-5 lg:col-span-4">
          <img
            src="../../../../src/assets/images/Logo-footer.svg"
            alt="logo-footer"
            className="absolute top-0"
          />
          <span className="text-util block mt-[150px] text-sm leading-6">
            <strong>CTY CP YOONY STORE VIỆT NAM</strong> <br />
            Địa chỉ Hà Nội : Villa Dương Nội Hà Đông,Hà Nội <br />
            Email : hotro@yoonystore.vn <br />
            Tổng đài CSKH : 084.6886.000 <br />
            Thời gian : 8:30 - 18:00 (Thứ 2 - Thứ 7)
          </span>
        </div>
        <div className="col-span-11 md:col-span-6 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10">
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h3 className={'font-medium'}>VỀ CHÚNG TÔI</h3>
            <ul className="text-sm leading-6">
              <li>
                <Link to={""}>Giới thiệu công ty</Link>
              </li>
              <li>
                <Link to={""}>Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to={""}>Chính sách giao nhận hàng</Link>
              </li>
              <li>
                <Link to={""}>Chính sách đổi & bảo hành</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className={'font-medium'}>HỖ TRỢ KHÁCH HÀNG 24/7</h3>
            <ul className="text-sm leading-6">
              <li>Hotline bán hàng : 084.6886.000</li>
              <li>Hotline kĩ thuật : 084.3434.000</li>
              <li>Email : hotro@yoonystore.vn</li>
              <li>Địa chỉ Hà Nội : Số 10 Ngõ 108 Trần Phú- Hà Đông- Hà Nội</li>
            </ul>
          </div>
          <div className="space-y-3 col-span-2 lg:col-span-1">
            <h3 className={'font-medium'}>PHƯƠNG THỨC THANH TOÁN</h3>
            <ul className="text-sm leading-6">
              <li>Thanh toán chuyển khoản</li>
              <li>Thanh toán khi nhận hàng</li>
              <li>Thanh toán Vnpay</li>
              <li>
                <Link to={""}>Chính sách đổi & bảo hành</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3 col-span-2">
            <h3 className={'font-medium'}>GIAO HÀNG</h3>
            <div className="flex items-center gap-5 flex-wrap">
              <img
                src="../../../../src/assets/images/viettel.png"
                alt="ship-viettel"
              />
              <img
                src="../../../../src/assets/images/ghtk.png"
                alt="ship-ghtk"
              />
              <img
                src="../../../../src/assets/images/giaohangnhanh.png"
                alt="ship-giaohangnhanh"
              />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className={'font-medium'}>MẠNG XÃ HỘI</h3>
            <div className="flex gap-3 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 16.9913 5.65783 21.1283 10.4385 21.8785V14.8906H7.89941V12H10.4385V9.79688C10.4385 7.29063 11.9314 5.90625 14.2156 5.90625C15.3097 5.90625 16.4541 6.10156 16.4541 6.10156V8.5625H15.1931C13.9509 8.5625 13.5635 9.33334 13.5635 10.1242V12H16.3369L15.8936 14.8906H13.5635V21.8785C18.3441 21.1283 22.001 16.9913 22.001 12C22.001 6.47715 17.5238 2 12.001 2Z"
                  fill="white"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12.001 2C17.6345 2 22.001 6.1265 22.001 11.7C22.001 17.2735 17.6345 21.4 12.001 21.4C11.0233 21.4023 10.0497 21.273 9.10648 21.0155C8.92907 20.9668 8.7403 20.9808 8.57198 21.055L6.58748 21.931C6.34398 22.0386 6.06291 22.018 5.83768 21.8761C5.61244 21.7342 5.47254 21.4896 5.46448 21.2235L5.40998 19.4445C5.40257 19.2257 5.30547 19.0196 5.14148 18.8745C3.19598 17.1345 2.00098 14.6155 2.00098 11.7C2.00098 6.1265 6.36748 2 12.001 2ZM5.99598 14.5365C5.71398 14.984 6.26398 15.488 6.68498 15.1685L9.84048 12.7735C10.0543 12.6122 10.3491 12.6122 10.563 12.7735L12.8995 14.5235C13.2346 14.7749 13.6596 14.8747 14.0716 14.7987C14.4836 14.7227 14.8451 14.4779 15.0685 14.1235L18.006 9.4635C18.288 9.016 17.738 8.512 17.317 8.8315L14.1615 11.2265C13.9476 11.3878 13.6528 11.3878 13.439 11.2265L11.1025 9.4765C10.7673 9.22511 10.3423 9.12532 9.93034 9.2013C9.51834 9.27728 9.15689 9.5221 8.93348 9.8765L5.99598 14.5365Z"
                  fill="white"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12.2439 4C12.778 4.00294 14.1143 4.01586 15.5341 4.07273L16.0375 4.09468C17.467 4.16236 18.8953 4.27798 19.6037 4.4755C20.5486 4.74095 21.2913 5.5155 21.5423 6.49732C21.942 8.05641 21.992 11.0994 21.9982 11.8358L21.9991 11.9884V11.9991C21.9991 11.9991 21.9991 12.0028 21.9991 12.0099L21.9982 12.1625C21.992 12.8989 21.942 15.9419 21.5423 17.501C21.2878 18.4864 20.5451 19.261 19.6037 19.5228C18.8953 19.7203 17.467 19.8359 16.0375 19.9036L15.5341 19.9255C14.1143 19.9824 12.778 19.9953 12.2439 19.9983L12.0095 19.9991H11.9991C11.9991 19.9991 11.9956 19.9991 11.9887 19.9991L11.7545 19.9983C10.6241 19.9921 5.89772 19.941 4.39451 19.5228C3.4496 19.2573 2.70692 18.4828 2.45587 17.501C2.0562 15.9419 2.00624 12.8989 2 12.1625V11.8358C2.00624 11.0994 2.0562 8.05641 2.45587 6.49732C2.7104 5.51186 3.45308 4.73732 4.39451 4.4755C5.89772 4.05723 10.6241 4.00622 11.7545 4H12.2439ZM9.99911 8.49914V15.4991L15.9991 11.9991L9.99911 8.49914Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
