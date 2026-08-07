import { useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown, User } from "lucide-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import UserCard from "./UserCard";
import "./UserMenu.css";

export default function UserMenu({ onLogout }) {
  const axiosPrivate = useAxiosPrivate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosPrivate.get("/users/me");

        setUser(response.data.user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [axiosPrivate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const getDisplayName = () => {
    if (loading) return "Loading...";
    return user?.fullname || "Unknown User";
  };

  return (
    <div
      className="user-menu"
      ref={menuRef}
    >
      {open && (
        <div className="user-menu-card">
          {loading ? (
            <div className="user-menu-loading">
              Loading...
            </div>
          ) : (
            <UserCard
              user={user}
              onLogout={onLogout}
            />
          )}
        </div>
      )}

      <button
        className="user-menu-button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="user-menu-left">
          <div className="user-menu-avatar">
            <User size={18} />
          </div>

          <span className="user-menu-name">
            {getDisplayName()}
          </span>
        </div>

        {open ? (
          <ChevronDown size={18} />
        ) : (
          <ChevronUp size={18} />
        )}
      </button>
    </div>
  );
}