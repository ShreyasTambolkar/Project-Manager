export default function DateField({ label, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#90A0B7" }}>
        {label}
      </label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full outline-none rounded-lg text-sm py-2.5 pl-3.5 pr-9 box-border"
          style={{
            border: `1.5px solid ${error ? "#E53E3E" : "#B8D4F5"}`,
            color: value ? "#1E3A5F" : "#A0AEC0",
            backgroundColor: error ? "#FFF5F5" : "#F0F7FF",
            fontFamily: "inherit",
          }}
        />
        <span className="absolute pointer-events-none right-3 top-1/2 -translate-y-1/2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#90A0B7" strokeWidth="1.8" />
            <line x1="3" y1="9" x2="21" y2="9" stroke="#90A0B7" strokeWidth="1.8" />
            <line x1="8" y1="2" x2="8" y2="6" stroke="#90A0B7" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="16" y1="2" x2="16" y2="6" stroke="#90A0B7" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      {error && (
        <p className="text-xs mt-0.5" style={{ color: "#C0392B" }}>{error}</p>
      )}
    </div>
  );
}