import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "./LogoBox.css";
import { ShieldCheck } from "lucide-react";

export default function LogoBox({ role, onNavigate }) {
  const navigate = useNavigate();

  return (
    <div className="logo-box">
      <img
        src={logo}
        alt="Savari Logo"
        onClick={() => {
          onNavigate()
          if (role === "user") {
            navigate("/user/dashboard");
          } else if (role === "admin") {
            navigate("/admin/dashboard");
          }
        }}
      />
    </div>
  );
}