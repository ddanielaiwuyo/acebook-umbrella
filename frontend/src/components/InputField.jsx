import "./InputField.css";

export function InputField({ type, placeholder, value, onChange, icon: Icon }) {
  return (
    <div className="input-wrapper">
      {Icon && <Icon className="input-icon" />}
      <input
        className="input-field"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}
