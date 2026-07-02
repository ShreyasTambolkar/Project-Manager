export default function DateField({ label, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#90A0B7" }}>
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full outline-none rounded-lg text-sm py-2.5 px-3.5 box-border"
        style={{
          border: `1.5px solid ${error ? "#E53E3E" : "#B8D4F5"}`,
          color: value ? "#1E3A5F" : "#A0AEC0",
          backgroundColor: error ? "#FFF5F5" : "#F0F7FF",
          fontFamily: "inherit",
        }}
      />
      {error && (
        <p className="text-xs mt-0.5" style={{ color: "#C0392B" }}>{error}</p>
      )}
    </div>
  );
}