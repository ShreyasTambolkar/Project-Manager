export const ActionBtn = ({ label, filled, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`text-xs font-medium mr-1 last:mr-0 transition-all duration-150
      py-[5px] px-3 rounded-[20px] whitespace-nowrap border-[1.5px] border-[#1A4D87]
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${filled
        ? "bg-[#1A4D87] text-white"
        : "bg-transparent text-[#1A4D87]"}`}
    style={{ fontFamily: "inherit" }}
  >
    {label}
  </button>
);

export const TH = ({ children }) => (
  <th
    className="text-left text-xs font-semibold whitespace-nowrap
               py-2.5 px-3 text-[#3D5170] bg-[#F0F5FB] border-b border-[#DDE6F0]"
  >
    {children}
  </th>
);

export const TD = ({ children, className: extra = "" }) => (
  <td
    className={`text-[13px] whitespace-nowrap align-middle
                py-2.5 px-3 text-[#4A5568] border-b border-[#EDF2F7] ${extra}`}
  >
    {children}
  </td>
);