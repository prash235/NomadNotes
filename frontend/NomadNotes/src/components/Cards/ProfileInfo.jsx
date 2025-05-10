import React from "react";
import { getInitials } from "../../utils/Helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    userInfo && (
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-950 font-semibold text-lg">
          {getInitials(userInfo?.fullName || "")}
        </div>

        {/* Name & Logout */}
        <div className="flex flex-col items-start">
          <p className="text-sm font-medium leading-tight">{userInfo?.fullName || ""}</p>
          <button
            className="text-xs text-blue-600 hover:underline mt-1"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfo;
