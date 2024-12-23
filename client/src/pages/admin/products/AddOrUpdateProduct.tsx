import { Link } from "react-router-dom";
import AddAttribute from "./AddAttribute";
import AddAttributeValue from "./AddAttributeValue";
import FormAddOrUpdateProduct from "./FormAddOrUpdateProduct";

const AddOrUpdateProduct = () => {
  return (
    <>
      <section className="flex justify-between gap-5">
        <div className="flex flex-col max-w-[250px] w-full gap-5">
          <div className="space-y-5">
            <AddAttribute />
            <AddAttributeValue />
          </div>
          <Link
            to={"/admin/products"}
            className="text-primary flex items-center gap-1.5 bg-util w-fit py-1.5 px-3 rounded-md hover:bg-primary hover:text-util transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-6"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M4.80823 9.44118L6.77353 7.46899C8.18956 6.04799 8.74462 5.28357 9.51139 5.55381C10.4675 5.89077 10.1528 8.01692 10.1528 8.73471C11.6393 8.73471 13.1848 8.60259 14.6502 8.87787C19.4874 9.78664 21 13.7153 21 18C19.6309 17.0302 18.2632 15.997 16.6177 15.5476C14.5636 14.9865 12.2696 15.2542 10.1528 15.2542C10.1528 15.972 10.4675 18.0982 9.51139 18.4351C8.64251 18.7413 8.18956 17.9409 6.77353 16.5199L4.80823 14.5477C3.60275 13.338 3 12.7332 3 11.9945C3 11.2558 3.60275 10.6509 4.80823 9.44118Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Quay lại
          </Link>
        </div>
        <div className="w-full bg-util px-4 py-5 rounded-lg h-fit">
          <FormAddOrUpdateProduct />
        </div>
      </section>
    </>
  );
};
export default AddOrUpdateProduct;
