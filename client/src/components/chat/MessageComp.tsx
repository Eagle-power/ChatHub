import { BsCheck2All } from "react-icons/bs";
import { GetUserIcon } from "../../Helpers";
import type { MessageCompProps } from "../../interfaces";

const formateTime = (date: Date) => {
  return new Date(date)
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

const MessageComp = ({
  user,
  message,
  timestamp,
  isOwnMessage, // CHANGED: Received from parent
}: MessageCompProps) => {
  return (
    <div
      className={`flex ${isOwnMessage ? "flex-row-reverse" : ""
        } space-x-2 max-w-xs md:max-w-md`}
    >
      <div className="rouded-full overflow-hidden">
        <GetUserIcon name={user.username} size={7} />
      </div>
      <div
        className={`rounded-xl mr-2 pr-3 shadow-sm ${isOwnMessage
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
            : "bg-white border border-slate-200 rounded-bl-none"
          }`}
      >
        <div className="flex justify-between items-baseline ml-1 space-x-4 mb-1">
          <span className={`text-xs font-medium ${isOwnMessage ? "text-blue-100" : "text-slate-600"}`}>
            {user.username}
            {isOwnMessage && "(You)"}
          </span>
          <span className={`text-xs  ${isOwnMessage ? "text-blue-200" : "text-slate-400"}`}>
            {formateTime(timestamp)}
          </span>
        </div>
        <p className="text-sm ml-1">{message}</p>

        {
          isOwnMessage && <div className="flex justify-end mt-1">
            <BsCheck2All className="h-3 w-3 text-blue-300" />
          </div>
        }
      </div>
    </div>
  );
};

export default MessageComp;