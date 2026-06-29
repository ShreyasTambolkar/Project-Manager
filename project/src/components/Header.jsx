import headerBg  from "../assets/header-bg.svg";
import logo      from "../assets/logo.svg";
import logoutIcon from "../assets/logout.svg";

export default function Header({ title, showBack, onBack, onLogout, isMobile }) {
  return (
    <header
      className="relative flex items-center"
      style={{ height: isMobile ? "100px" : "150px" }}
    >
      <img
        src={headerBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-left-center"
        style={{ borderRadius: "0 0 0 60px" }}
      />

      {/* Left: back arrow + title */}
      <div
        className="relative z-10 flex items-center"
        style={{
          gap: isMobile ? "0.5rem" : "0.75rem",
          paddingLeft: isMobile ? "1rem" : "2rem",
        }}
      >
        {showBack && (
          <button
            onClick={onBack}
            className="bg-transparent border-none cursor-pointer p-0"
          >
            <svg
              width={isMobile ? "9" : "10"}
              height={isMobile ? "15" : "17"}
              viewBox="0 0 10 17"
              fill="none"
            >
              <path d="M9 1L1 8.5L9 16" stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <h1
          className="font-bold tracking-wide text-white truncate"
          style={{
            fontSize: isMobile ? "1rem" : "22px",
            maxWidth: isMobile ? "140px" : "none",
          }}
        >
          {title}
        </h1>
      </div>

  {/* Center: logo */}
   {!isMobile && (
  <div className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
    <img
      src={logo}
      alt="Logo"
      style={{ height: isMobile ? "36px" : "62px" }}
    />
  </div>
    )}
      {/* Right: logout — visible on mobile only (sidebar has logout on desktop) */}
      {isMobile && (
        <button
          onClick={onLogout}
          className="absolute z-10 right-4 top-1/2 -translate-y-1/2
                     flex items-center justify-center w-9 h-9 rounded-lg
                     bg-white/15 border-none cursor-pointer"
          title="Logout"
        >
          <img
            src={logoutIcon}
            alt="Logout"
            className="w-5 h-5 brightness-0 invert"
          />
        </button>
      )}
    </header>
  );
}