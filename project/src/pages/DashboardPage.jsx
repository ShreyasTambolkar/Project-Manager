import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";

import Sidebar  from "../components/Sidebar";
import Header   from "../components/Header";
import StatCard from "../components/StatCard";

import ProjectListing from "./ProjectListingPage";
import CreateProject  from "./CreateProjectPage";

import { STATS_API, CHARTS_API } from "../services/api";

// ─── useIsMobile Hook ─────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint
  );

  useLayoutEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);

  return isMobile;
}

// ─── Dept code helper ─────────────────────────────────────────────────────────
const DEPT_CODE_OVERRIDES = { quality: "QLT" };

const toDeptCode = (name) => {
  if (!name) return "—";
  const key = name.trim().toLowerCase();
  if (DEPT_CODE_OVERRIDES[key]) return DEPT_CODE_OVERRIDES[key];
  return name.length > 3 ? name.slice(0, 3).toUpperCase() : name.toUpperCase();
};

// ─── Stat cards config ────────────────────────────────────────────────────────
const CARDS = [
  { label: "Total Projects", key: "total"        },
  { label: "Closed",         key: "closed"       },
  { label: "Running",        key: "running"      },
  { label: "Closure Delay",  key: "closureDelay" },
  { label: "Cancelled",      key: "cancelled"    },
];

// ─── Dept Chart ───────────────────────────────────────────────────────────────
const DeptChart = ({ data, isMobile }) => {
  const chartRef      = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    const depts  = data.map((d) => d.department);
    const totals = data.map((d) => Number(d.total));
    const closed = data.map((d) => Number(d.closed));
    const pct    = totals.map((t, i) =>
      t > 0 ? Math.round((closed[i] / t) * 100) : 0
    );

    let cancelled = false;

    import("highcharts").then((HighchartsModule) => {
      if (cancelled) return;

      const HC = HighchartsModule.default ?? HighchartsModule;

      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }

      chartInstance.current = HC.chart(chartRef.current, {
        chart: {
          type: "column",
          backgroundColor: "#FFFFFF",
          style: { fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" },
          height: 280,
          marginBottom: 80,
          marginTop: 20,
          marginLeft: 40,
          marginRight: 10,
          reflow: true,
        },
        title:   { text: null },
        credits: { enabled: false },
        accessibility: { enabled: false },
        legend: {
          enabled: true,
          align: "center",
          verticalAlign: "bottom",
          y: 10,
          symbolRadius: 50,
          symbolHeight: 8,
          symbolWidth: 8,
          margin: 4,
          itemStyle: { color: "#6B7A99", fontWeight: "400", fontSize: "11px" },
        },
        xAxis: {
          categories: depts,
          lineColor: "transparent",
          tickColor: "transparent",
          labels: {
            useHTML: true,
            style: { fontSize: "10px" },
            formatter() {
              const i = this.pos;
              return `<div style="text-align:center;line-height:1.4">
                <span style="font-weight:700;color:#1A2B4A;font-size:10px">${pct[i]}%</span><br/>
                <span style="color:#6B7A99;font-size:10px">${toDeptCode(this.value)}</span>
              </div>`;
            },
          },
        },
        yAxis: {
          title: { text: null },
          gridLineColor: "rgba(0,0,0,0.06)",
          labels: { style: { color: "#6B7A99", fontSize: "10px" } },
          tickInterval: 5,
          min: 0,
        },
        tooltip: {
          shared: true,
          backgroundColor: "#FFFFFF",
          borderColor: "none",
          borderRadius: 8,
          style: { color: "#1A2B4A", fontSize: "11px" },
          formatter() {
            const i = this.points[0].point.index;
            return `<b>${depts[i]}</b><br/>
              Total: <b>${totals[i]}</b><br/>
              Closed: <b>${closed[i]}</b><br/>
              Closure rate: <b>${pct[i]}%</b>`;
          },
        },
        plotOptions: {
          column: {
            borderRadius: 3,
            borderWidth: 0,
            groupPadding: 0.25,
            pointPadding: 0.12,
            maxPointWidth: 12,
            dataLabels: {
              enabled: true,
              style: {
                fontSize: "10px",
                fontWeight: "400",
                color: "#374151",
                textOutline: "none",
              },
            },
          },
        },
        responsive: {
          rules: [{
            condition: { maxWidth: 400 },
            chartOptions: {
              chart: { height: 220 },
              xAxis: {
                labels: {
                  formatter() {
                    const i = this.pos;
                    return `<div style="text-align:center;line-height:1.3">
                      <span style="font-weight:700;color:#1A2B4A;font-size:9px">${pct[i]}%</span><br/>
                      <span style="color:#6B7A99;font-size:9px">${toDeptCode(this.value)}</span>
                    </div>`;
                  },
                },
              },
              legend: { itemStyle: { fontSize: "10px" } },
              plotOptions: { column: { maxPointWidth: 14 } },
            },
          }],
        },
        series: [
          { name: "Total",  data: totals, color: "#1A56C4" },
          { name: "Closed", data: closed, color: "#3DAA6E" },
        ],
      });
    });

    return () => {
      cancelled = true;
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, isMobile]);

  return (
    <div
      className="mx-4 sm:mx-6 mt-6 mb-4 bg-white rounded-xl border border-[#E4EAF0]
                 p-4 pb-2 max-w-[640px]"
    >
      <div ref={chartRef} className="w-full" />
    </div>
  );
};

// ─── Dashboard Home ───────────────────────────────────────────────────────────
const DashboardHome = ({ isMobile }) => {
  const [stats,    setStats]    = useState(null);
  const [deptData, setDeptData] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, deptRes] = await Promise.all([
          fetch(`${STATS_API}/projects/stats`),
          fetch(`${CHARTS_API}/projects/chart/dept-stats`),
        ]);

        if (!statsRes.ok) throw new Error(`Server error ${statsRes.status}`);
        const statsData = await statsRes.json();
        setStats({
          total:        statsData.total,
          closed:       statsData.closed,
          running:      statsData.running,
          closureDelay: statsData.closure_delay,
          cancelled:    statsData.cancelled,
        });

        if (deptRes.ok) {
          const deptJson = await deptRes.json();
          setDeptData(deptJson);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div>
      {error && (
        <div
          className="mx-4 sm:mx-6 mt-4 px-4 py-2.5 rounded-lg text-sm
                     bg-[#FFF0F0] border border-[#FFCDD2] text-[#C0392B]"
        >
          ⚠ Could not load stats: {error}
        </div>
      )}

      <div
        className="px-4 sm:px-6 pt-6"
        style={{
          display: "flex",
          flexDirection: "row",
          overflowX: isMobile ? "auto" : undefined,
          gap: isMobile ? "0.75rem" : "1rem",
          marginTop: isMobile ? "1rem" : "-1.75rem",
          paddingBottom: isMobile ? "0.5rem" : undefined,
          flexWrap: "nowrap",
        }}
      >
        {CARDS.map((c) => (
          <StatCard
            key={c.key}
            label={c.label}
            value={stats ? stats[c.key] : 0}
            loading={loading}
          />
        ))}
      </div>

      {!loading && deptData.length > 0 && (
        <>
          <p className="text-[20px] font-semibold text-[#1A2B4A] ml-10 mt-10">
            Department wise - Total Vs Closed
          </p>
          <DeptChart data={deptData} isMobile={isMobile} />
        </>
      )}

      {loading && (
        <div
          className="mx-4 sm:mx-6 h-[320px] rounded-xl border border-[#E4EAF0]
                     bg-white flex items-center justify-center"
        >
          <span className="text-[#90A0B7] text-sm">Loading chart…</span>
        </div>
      )}
    </div>
  );
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage({ onLogout, user }) {
  const isMobile = useIsMobile();

  const [pageStack, setPageStack] = useState(["dashboard"]);
  const activePage = pageStack[pageStack.length - 1];

  const setActivePage = (page) => {
    setPageStack((prev) => {
      if (prev[prev.length - 1] === page) return prev;
      return [...prev, page];
    });
  };

  const handleBack = () => {
    setPageStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const pageTitles = {
    dashboard: "Dashboard",
    projects:  "Project Listing",
    create:    "Create Project",
  };

  const showBack = pageStack.length > 1;

  const HEADER_H     = 56;
  const BOTTOM_NAV_H = 60;

  return (
    <div
      className="min-h-screen flex bg-[#EEF2F7]"
      style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}
    >
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
        isMobile={isMobile}
      />

      <div
        className="flex-1 flex flex-col min-w-0"
        style={{ marginLeft: isMobile ? 0 : "58px" }}
      >
        <Header
          title={pageTitles[activePage] || "Dashboard"}
          showBack={showBack}
          onBack={handleBack}
          onLogout={onLogout}
          isMobile={isMobile}
        />

        <main
          className="flex-1 w-full relative z-10"
          style={
            isMobile
              ? {
                  overflowY: "auto",
                  paddingBottom: `calc(${BOTTOM_NAV_H}px + env(safe-area-inset-bottom))`,
                }
              : {}
          }
        >
          {activePage === "dashboard" && <DashboardHome isMobile={isMobile} />}
          {activePage === "projects"  && <ProjectListing isMobile={isMobile} />}
          {activePage === "create"    && <CreateProject />}
        </main>
      </div>
    </div>
  );
}