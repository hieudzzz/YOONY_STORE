import { useState } from "react";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  return (
    <form action="" className="hidden md:block overflow-hidden" onSubmit={handleSearch}>
      <div className="flex border rounded-full bg-util">
        <div className="h-[36px] lg:h-[40px] min-w-[250px] lg:min-w-[275px]">
          <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} id="searchInput" placeholder="Tìm sản phẩm" className="text-sm w-full rounded-full h-full border-none focus:!outline-none" />
        </div>
        <div className="h-full">
          <button type="submit" className="h-9 w-9 lg:h-10 lg:w-10 bg-primary rounded-full flex justify-center items-center text-util">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
