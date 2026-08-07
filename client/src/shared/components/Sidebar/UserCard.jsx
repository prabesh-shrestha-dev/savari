import {
  User,
  Mail,
  Phone,
  Shield,
  CalendarDays,
  CreditCard,
  LogOut,
  BadgeCheck,
} from "lucide-react";
import "./UserCard.css";

export default function UserCard({
  user,
  onLogout,
}) {
  if (!user) return null;

  const initials = user.fullname
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const isEmail = user.identifier.includes("@");

  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-avatar">
          {initials || <User size={28} />}
        </div>

        <div className="user-basic-info">
          <h3>{user.fullname}</h3>

          <span
            className={`role-badge ${user.role}`}
          >
            {user.role}
          </span>
        </div>
      </div>

      <div className="user-card-body">
        <div className="user-info-row">
          {isEmail ? (
            <Mail size={18} />
          ) : (
            <Phone size={18} />
          )}

          <span>{user.identifier}</span>
        </div>

        <div className="user-info-row">
          <Shield size={18} />

          <span>
            ID: {user._id.slice(-8)}
          </span>
        </div>

        <div className="user-info-row">
          <CalendarDays size={18} />

          <span>
            Joined{" "}
            {new Date(
              user.createdAt
            ).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="user-card-footer">
        <button
          className="logout-btn"
          onClick={onLogout}
        >
          <LogOut size={18} />

          Logout
        </button>
      </div>
    </div>
  );
}