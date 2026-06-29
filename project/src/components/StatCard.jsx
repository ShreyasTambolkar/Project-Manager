export default function StatCard({ label, value, loading }) {
  return (
    <div
      className="bg-white relative overflow-hidden rounded-lg
                 shadow-[0_2px_8px_rgba(0,0,0,0.08)] min-h-[72px] mt-[-35px]
                 shrink-0 w-[140px] sm:flex-1 sm:w-auto sm:min-w-0"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-[#00C2D4]" />
      <div className="pl-4 sm:pl-5 pr-3 sm:pr-4 pt-2.5 sm:pt-3 pb-3 sm:pb-4">
        <p className="font-medium mb-1 leading-tight text-xs sm:text-[13px] text-[#8A9BB0]">
          {label}
        </p>
        {loading ? (
          <div className="w-8 h-7 sm:h-8 mt-1 rounded bg-[#EDF2F7] animate-pulse" />
        ) : (
          <p className="font-bold leading-none text-2xl sm:text-[32px] text-[#1E3A5F]">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}