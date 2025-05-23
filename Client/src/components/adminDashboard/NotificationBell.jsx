import { FaBell } from "react-icons/fa";

const NotificationBell = ({ count }) => {
  return (
    <div className="relative">
      <FaBell className="text-2xl text-white" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
