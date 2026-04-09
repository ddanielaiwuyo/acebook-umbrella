import "./InputField.css";

export function InputField({ type, placeholder, value, onChange }) {
  return (
    <input
      className="input-field"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  );
}
