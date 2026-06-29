export default function SelectField({ label, value, onChange, options, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#90A0B7" }}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none outline-none cursor-pointer rounded-lg text-sm py-2.5 pl-3.5 pr-9 sm:py-2.5 sm:pl-3.5 sm:pr-9"
          style={{
            border: `1.5px solid ${error ? "#E53E3E" : "#DDE6F0"}`,
            color: "#1E3A5F",
            backgroundColor: "#fff",
            fontFamily: "inherit",
          }}
        >
          <option value="" disabled>Select {label}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <span className="absolute pointer-events-none right-3 top-1/2 -translate-y-1/2">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 7L11 1" stroke="#3D5170" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {error && (
        <p className="text-xs mt-0.5" style={{ color: "#C0392B" }}>{error}</p>
      )}
    </div>
  );
}