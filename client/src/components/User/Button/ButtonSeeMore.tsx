import { Link } from "react-router-dom";

type Props = {
  link: string;
};

const ButtonSeeMore = ({ link }: Props) => {
  return (
    <div>
      <Link
        to={link}
        className="text-util font-medium uppercase px-[15px] py-2 bg-primary rounded-lg w-fit flex gap-1 mx-auto"
      >
        Xem thêm sản phẩm{" "}
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
            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </Link>
    </div>
  );
};

export default ButtonSeeMore;
