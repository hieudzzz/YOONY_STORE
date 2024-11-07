import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import NavMenuUser from "./NavMenuUser";
const HeaderUser = () => {
  return (
    <header className="h-[60px] lg:h-[65px] flex items-center border-b border-primary/25 sticky top-0 z-[60] bg-util/80 backdrop-blur">
      <div className="flex container-main items-center justify-between">
        <div className="max-w-[65px] md:max-w-[75px] lg:max-w-full">
          <Link to={"/"}>
            <img
              src="../../../public/logo-web.svg"
              alt="logo-website"
              className="w-full"
            />
          </Link>
        </div>
        <SearchBar />
        <NavMenuUser />
        <div className="lg:hidden flex gap-5 items-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 block md:hidden cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-7 md:size-8 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default HeaderUser;
