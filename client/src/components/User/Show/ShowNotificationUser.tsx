import { useContext } from "react";
import { Link } from "react-router-dom";
import HTMLReactParser from "html-react-parser";
import { NotificationsContext } from "../../../contexts/NotificationsContext";

const ShowNotificationUser = () => {
  const { notifications } = useContext(NotificationsContext);
  const reatnotifi = notifications.filter(item => item.is_read==0)
  return (
    <div className="px-2 py-5">
      {notifications.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="size-12"
            color={"#DFDFDF"}
            fill={"none"}
          >
            <path
              d="M12.5 3H11.5C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C21 19.2175 21 16.9783 21 12.5V11.5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2C20.433 2 22 3.567 22 5.5Z"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M7 11H11"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 16H15"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm text-slate-300">Chưa có thông báo</span>
        </div>
      ) : (
        <div className="max-w-[400px] space-y-3">
          {reatnotifi.slice(0, 5).map((notification) => {
            return (
              <Link
                key={notification.id}
                to={`/count-unread-notification/{id}/${reatnotifi.filter(item => item.is_read==0)}`}
                className="block"
              >
                {HTMLReactParser(notification.content)}
              </Link>
            );
          })}
          <button className="ml-auto block">
            <Link
              to={"/thongbao"}
              className="py-2 px-4 bg-primary hover:text-util text-util rounded-sm"
            >
              Xem tất cả
            </Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowNotificationUser;
