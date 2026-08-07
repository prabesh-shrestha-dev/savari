import "./LogoBox.css";
import { ShieldCheck } from "lucide-react";

export default function LogoBox() {
  return (
    <div className="logo-box">
      <div className="logo-icon">
        <ShieldCheck size={34} strokeWidth={2.2} />
      </div>

      <div className="logo-content">
        <h2 className="logo-title">
          SAVARI
        </h2>

        <p className="logo-tagline">
          LESS WAIT, DRIVE MORE
        </p>
      </div>
    </div>
  );
}