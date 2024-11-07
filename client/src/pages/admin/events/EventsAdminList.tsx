import { Table } from "flowbite-react";

const EventsAdminList = () => {
  return (
    <div className="col-span-8 bg-util rounded-lg">
      <div className="overflow-x-auto rounded-lg">
        <Table hoverable>
          <Table.Head className="text-center">
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              STT
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Tên sự kiện
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Vé giảm giá
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Thời gian
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Trạng thái
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Hành động
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {/* {categories
              .filter((item) => {
                return item.name
                  .toLowerCase()
                  .includes(valSearch.toLowerCase());
              })
              .map((category, index) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
                    key={category.id}
                  >
                    <Table.Cell className="font-medium text-primary text-base border-[#f5f5f5] border-r ">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-secondary dark:text-white">
                      <Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={[valSearch.toLowerCase()]}
                        autoEscape={true}
                        textToHighlight={category.name}
                      />
                    </Table.Cell>
                    <Table.Cell>{category.slug}</Table.Cell>
                    <Table.Cell>
                      <img
                        src={category.image}
                        className="h-10 mx-auto w-10 rounded-full object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          checked={category.is_active}
                          onChange={() =>
                            handleToggleActive(
                              category.id!,
                              !category.is_active
                            )
                          }
                          type="checkbox"
                          defaultValue=""
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary peer-checked:after:border-white" />
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                      </label>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-util shadow py-1.5 px-3 rounded-md"
                          onClick={() => {
                            setOpenModal(true);
                            SetAddOrUpdate("UPDATE");
                            fillDataFormUpdate(category.id!);
                          }}
                        >
                          <svg
                            className="size-5"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              stroke="#1FD178"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeMiterlimit="10"
                              strokeWidth="1.5"
                              d="M11.05 3l-6.842 7.242c-.258.275-.508.816-.558 1.191l-.308 2.7c-.109.975.591 1.642 1.558 1.475l2.683-.458c.375-.067.9-.342 1.159-.625l6.841-7.242c1.184-1.25 1.717-2.675-.125-4.416C13.625 1.142 12.233 1.75 11.05 3zM9.908 4.208A5.105 5.105 0 0014.45 8.5M2.5 18.333h15"
                            ></path>
                          </svg>
                        </button>
                        <button
                          className="bg-util shadow py-1.5 px-3 rounded-md"
                          onClick={() => {
                            handleDelete(category.id!);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-5"
                            color={"#F31260"}
                            fill={"none"}
                          >
                            <path
                              d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M9.5 16.5L9.5 10.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M14.5 16.5L14.5 10.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })} */}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default EventsAdminList;
