import { GetUserIcon } from "../../Helpers";
import type { SidebarProps } from "../../interfaces";

const Sidebar = ({ users, currentUser }: SidebarProps) => {
  return (
    <div className="hidden md:block w-64 border-r  border-gray-200">
      <div className="p-4">
        <h3 className="text-xs font-semibold  text-gray-400 uppercase tracking-wide mb-4">
          Active members - {users.length}
        </h3>
        <div className="space-y-1">
          {users.map((member) => { // Changed variable name to 'member' to avoid confusion
            const isMe = member.id === currentUser.id;
            return (
              <div
                key={member.id}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg
                  ${isMe
                    ? "bg-violet-50 text-violet-700"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <div className="relative">
                  <GetUserIcon name={member.username} size={6} />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <p className="text-sm  font-medium">
                    {member.username}
                    {isMe && " (You)"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;