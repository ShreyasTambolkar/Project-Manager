import { useState, useEffect, useMemo } from "react";
import { ActionBtn, TH, TD } from "../components/ActionBtn";
import { LISTING_API } from "../services/api";

const PAGE_SIZE = 10;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return dt
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");
};

// Fields shown in the mobile card body, in order
const CARD_FIELDS = [
  { key: "reason",     label: "Reason"   },
  { key: "type",       label: "Type"     },
  { key: "division",   label: "Division" },
  { key: "category",   label: "Category" },
  { key: "priority",   label: "Priority" },
  { key: "department", label: "Dept."    },
  { key: "location",   label: "Location" },
];

// ─── ProjectCard (mobile) ────────────────────────────────────────────────────
function ProjectCard({ p, isActioning, onAction }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#E8EDF5] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="font-semibold text-sm text-[#1E3A5F]">
          {p.project_name}
        </div>
        <span className="text-xs font-bold whitespace-nowrap text-[#1E3A5F]">
          {p.status || "—"}
        </span>
      </div>
      <div className="text-[11px] mb-3 text-[#90A0B7]">
        {fmtDate(p.start_date)} to {fmtDate(p.end_date)}
      </div>
      <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-3 *:min-w-0">
        {CARD_FIELDS.map((f) => (
          <div key={f.key}>
            <div className="text-[10px] uppercase tracking-wide text-[#A0AEC0]">
              {f.label}
            </div>
            <div className="text-[13px] text-[#4A5568]">{p[f.key] || "—"}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 pt-2 border-t border-[#EDF2F7]">
        <ActionBtn
          label="Start"
          filled
          disabled={isActioning}
          onClick={() => onAction(p.project_id, "start")}
        />
        <ActionBtn
          label="Close"
          filled={false}
          disabled={isActioning}
          onClick={() => onAction(p.project_id, "close")}
        />
        <ActionBtn
          label="Cancel"
          filled={false}
          disabled={isActioning}
          onClick={() => onAction(p.project_id, "cancel")}
        />
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([
    1,
    2,
    total - 1,
    total,
    current - 1,
    current,
    current + 1,
  ]);
  return [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageList = buildPageList(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center flex-wrap gap-1.5 py-5">
      {pageList.map((p, idx) => {
        const prev = pageList[idx - 1];
        const showEllipsis = idx > 0 && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {showEllipsis && (
              <span className="text-sm px-1 text-[#A0AEC0]">…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`text-sm font-medium transition-colors w-[30px] h-[30px] rounded-full
                cursor-pointer border
                ${
                  p === currentPage
                    ? "bg-[#1A4D87] text-white border-transparent"
                    : "bg-white text-[#6B7A99] border-[#E2E8F0] hover:bg-[#F7FAFC]"
                }`}
              style={{ fontFamily: "inherit" }}
            >
              {p}
            </button>
          </span>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProjectListingPage({ isMobile }) {
  const [projects,      setProjects]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [search,        setSearch]        = useState("");
  const [sortBy,        setSortBy]        = useState("Priority");
  const [actionLoading, setActionLoading] = useState(null);
  const [currentPage,   setCurrentPage]   = useState(1);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchProjects = async (q = "", sort = "Priority") => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (q.trim()) {
        url = `${LISTING_API}/projects?q=${encodeURIComponent(q.trim())}`;
      } else {
        url = `${LISTING_API}/projects/sorted?sort=${sort.toLowerCase()}`;
      }

      const res = await fetch(url);
      if (res.status === 404) {
        setProjects([]);
        setCurrentPage(1);
        return;
      }
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects("", "Priority");
  }, []);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchProjects(search, sortBy), 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleSortChange = (val) => {
    setSortBy(val);
    fetchProjects(search, val);
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const callAction = async (projectId, action) => {
    setActionLoading(`${projectId}-${action}`);
    try {
      const res = await fetch(`${LISTING_API}/projects/${projectId}/${action}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Action failed.");
        return;
      }

      const STATUS_MAP = {
        start:  "Running",
        close:  "Closed",
        cancel: "Cancelled",
      };
      const newStatus = data.status || STATUS_MAP[action] || action;
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === projectId ? { ...p, status: newStatus } : p
        )
      );
    } catch (e) {
      alert("Network error: " + e.message);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Pagination logic ───────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return projects.slice(start, start + PAGE_SIZE);
  }, [projects, currentPage]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="bg-white relative z-10 sm:-mt-4 rounded-xl sm:rounded-t-xl
                 mx-2 shadow-sm overflow-x-hidden"  // ✅ FIXED: was overflow-hidden, which clipped pagination on mobile
      style={{ minHeight: "calc(100dvh - 100px)" }}
    >
      {/* ── Search + Sort bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
              <line
                x1="14" y1="14" x2="19" y2="19"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-[15px] py-1 pl-7 pr-2
                       border-b-[1.5px] border-[#A0AEC0] text-[#3D5170]"
            style={{ fontFamily: "inherit" }}
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2 text-sm self-end sm:self-auto text-[#6B7A99]">
          <span>Sort By :</span>
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border-none bg-transparent font-semibold text-sm cursor-pointer
                         outline-none appearance-none pr-4 text-[#3D5170]"
              style={{ fontFamily: "inherit" }}
            >
              <option>Priority</option>
              <option>Status</option>
              <option>Name</option>
            </select>
            <svg
              className="absolute right-0 pointer-events-none"
              width="10" height="6" viewBox="0 0 12 8" fill="none"
            >
              <path
                d="M1 1L6 7L11 1"
                stroke="#3D5170" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── States: loading / error / empty / data ── */}
      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="w-9 h-9 border-3 border-[#DDE6F0] border-t-[#1A4D87] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center px-4 text-center h-[300px]">
          <p className="text-[#C0392B] text-sm mb-3">⚠ {error}</p>
          <button
            onClick={() => fetchProjects(search, sortBy)}
            className="px-5 py-2 text-sm rounded-md bg-[#1A4D87] text-white border-none cursor-pointer"
            style={{ fontFamily: "inherit" }}
          >
            Retry
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-[#A0AEC0] text-sm">No projects found.</p>
        </div>
      ) : (
        <>
          {isMobile ? (
            <div className="flex flex-col w-full">
              <div className="flex flex-col gap-3 p-4 pb-6">
                {paginatedProjects.map((p) => (
                  <ProjectCard
                    key={p.project_id}
                    p={p}
                    isActioning={actionLoading?.startsWith(`${p.project_id}-`)}
                    onAction={callAction}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  // Scroll the parent <main> container back to top
                  const main = document.querySelector("main");
                  if (main) main.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          ) : (
            // Tablet / Desktop: scrollable table
            <div className="px-2 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#F2F6FA]">
                  <tr>
                    <TH>Project Name</TH>
                    <TH>Reason</TH>
                    <TH>Type</TH>
                    <TH>Division</TH>
                    <TH>Category</TH>
                    <TH>Priority</TH>
                    <TH>Dept.</TH>
                    <TH>Location</TH>
                    <TH>Status</TH>
                    <TH> </TH>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProjects.map((p, idx) => {
                    const id          = p.project_id;
                    const isActioning = actionLoading?.startsWith(`${id}-`);
                    return (
                      <tr
                        key={id}
                        className={`border-b border-[#E8EDF5]
                          ${idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFD]"}`}
                      >
                        <TD>
                          <div className="font-semibold text-[#1E3A5F] text-[13px]">
                            {p.project_name}
                          </div>
                          <div className="text-[11px] text-[#90A0B7] mt-0.5">
                            {fmtDate(p.start_date)} to {fmtDate(p.end_date)}
                          </div>
                        </TD>
                        <TD>{p.reason     || "—"}</TD>
                        <TD>{p.type       || "—"}</TD>
                        <TD>{p.division   || "—"}</TD>
                        <TD>{p.category   || "—"}</TD>
                        <TD>{p.priority   || "—"}</TD>
                        <TD>{p.department || "—"}</TD>
                        <TD>{p.location   || "—"}</TD>
                        <TD>
                          <span className="font-bold text-[#1E3A5F]">
                            {p.status || "—"}
                          </span>
                        </TD>
                        <TD>
                          <div className="flex items-center gap-2">
                            <ActionBtn
                              label="Start"
                              filled
                              disabled={isActioning}
                              onClick={() => callAction(id, "start")}
                            />
                            <ActionBtn
                              label="Close"
                              filled={false}
                              disabled={isActioning}
                              onClick={() => callAction(id, "close")}
                            />
                            <ActionBtn
                              label="Cancel"
                              filled={false}
                              disabled={isActioning}
                              onClick={() => callAction(id, "cancel")}
                            />
                          </div>
                        </TD>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination for desktop */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}