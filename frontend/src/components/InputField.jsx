import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./InputField.css";

export function InputField({ type, placeholder, value, onChange, icon: Icon }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="input-wrapper">
      {Icon && <Icon className="input-icon" />}
      <input
        className="input-field"
        // type={type}
        type={isPassword && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      {isPassword && (
        <span
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
  );
}
