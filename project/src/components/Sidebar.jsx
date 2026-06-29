import dashboardActive     from "../assets/dashboard-active.svg";
import dashboardInactive   from "../assets/dashboard.svg";
import projectListActive   from "../assets/project-list-active.svg";
import projectListInactive from "../assets/project-list.svg";
import createProjectActive   from "../assets/create-project-active.svg";
import createProjectInactive from "../assets/create-project.svg";
import logoutIcon            from "../assets/logout.svg";

export default function Sidebar({ activePage, setActivePage, onLogout, isMobile }) {
  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      activeIcon: dashboardActive,
      inactiveIcon: dashboardInactive,
      iconW: 25, iconH: 20,
    },
    {
      key: "projects",
      label: "Project List",
      activeIcon: projectListActive,
      inactiveIcon: projectListInactive,
      iconW: 23, iconH: 21,
    },
  ];

  return (
    <div>
      {/* ───── Desktop / tablet: fixed left rail ───── */}
      {!isMobile && (
        <aside
          className="fixed left-0 top-0 bottom-0 flex flex-col items-center py-5 z-20
                     w-[58px] bg-white shadow-[2px_0_10px_rgba(0,0,0,0.07)] pt-[240px]"
        >
          <div className="flex flex-col items-center gap-6 flex-1 w-full">
            {navItems.map((item) => {
              const isActive = activePage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActivePage(item.key)}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-150
                    ${isActive ? "bg-[#EBF3FB]" : "bg-transparent"}`}
                  title={item.label}
                >
                  <img
                    src={isActive ? item.activeIcon : item.inactiveIcon}
                    alt={item.label}
                    style={{ width: item.iconW, height: item.iconH }}
                  />
                </button>
              );
            })}

            <div className="w-full h-px bg-[#E4EAF0]" />

            <button
              onClick={() => setActivePage("create")}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-150
                ${activePage === "create" ? "bg-[#EBF3FB]" : "bg-transparent"}`}
              title="Create Project"
            >
              <img
                src={activePage === "create" ? createProjectActive : createProjectInactive}
                alt="Create Project"
                className="w-[22px] h-[22px]"
              />
            </button>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-red-50 transition-all duration-150"
            title="Logout"
          >
            <img src={logoutIcon} alt="Logout" className="w-[22px] h-[22px]" />
          </button>
        </aside>
      )}

      {/* ───── Mobile: fixed bottom tab bar ───── */}
      {isMobile && (
        <nav
          className="fixed bottom-0 left-0 right-0 flex items-center justify-around z-20
                     h-[60px] bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.07)] pb-[env(safe-area-inset-bottom)]"
        >
          {/* Dashboard */}
          {navItems.slice(0, 1).map((item) => {
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className="flex flex-1 flex-col items-center justify-center h-full
                           cursor-pointer bg-transparent border-none p-0"
              >
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-lg
                    ${isActive ? "bg-[#EBF3FB]" : "bg-transparent"}`}
                >
                  <img
                    src={isActive ? item.activeIcon : item.inactiveIcon}
                    alt={item.label}
                    style={{ width: item.iconW, height: item.iconH }}
                  />
                </span>
              </button>
            );
          })}

          {/* Create — middle */}
          <button
            onClick={() => setActivePage("create")}
            className="flex flex-1 flex-col items-center justify-center gap-1 h-full
                       cursor-pointer bg-transparent border-none p-0"
          >
            <span
              className={`flex items-center justify-center w-9 h-9 rounded-lg
                ${activePage === "create" ? "bg-[#EBF3FB]" : "bg-transparent"}`}
            >
              <img
                src={activePage === "create" ? createProjectActive : createProjectInactive}
                alt="Create Project"
                className="w-5 h-5"
              />
            </span>
          </button>

          {/* Project List */}
          {navItems.slice(1, 2).map((item) => {
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className="flex flex-1 flex-col items-center justify-center h-full
                           cursor-pointer bg-transparent border-none p-0"
              >
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-lg
                    ${isActive ? "bg-[#EBF3FB]" : "bg-transparent"}`}
                >
                  <img
                    src={isActive ? item.activeIcon : item.inactiveIcon}
                    alt={item.label}
                    style={{ width: item.iconW, height: item.iconH }}
                  />
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}