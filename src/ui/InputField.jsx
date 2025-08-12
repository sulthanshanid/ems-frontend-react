export default function InputField({ label, id, type = "text", placeholder, value, onChange, required, children, className }) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1 font-medium text-gray-900 flex justify-between items-center">
        <span>{label}</span>
        {children}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3075b5] ${className}`}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
