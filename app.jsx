import { useState, useEffect, useCallback } from "react";

// ============================================================
// CONFIGURATION — Edit this to add/remove sites and nodes
// ============================================================
const CONFIG = {
  refreshInterval: 120, // seconds
  companyName: "Hector Hosting",
  websites: [
    { id: "w1", name: "hectorhosting.com", url: "https://hectorhosting.com" },
    { id: "w2", name: "Free Panel", url: "https://panel.hectorhosting.com" },
    { id: "w3", name: "Paid Panel", url: "https://ppanel.hectorhosting.com" },
    { id: "w4", name: "Client Area", url: "https://paid.hectorhosting.com" },
  ],
  freeNodes: [
    { id: "fn1", name: "DE-01" },
    { id: "fn2", name: "DE-02" },
    { id: "fn3", name: "DE-03" },
    { id: "fn4", name: "DE-04" },
    { id: "fn5", name: "DE-05" },
    { id: "fn6", name: "DE-06" },
  ],
  paidNodes: [
    { id: "pn1", name: "CA-PRM-01" },
    { id: "pn2", name: "CA-PRM-02" },
    { id: "pn3", name: "DE-PRM-01" },
  ],
};
// ============================================================

// Simulate service data (replace with real API calls if needed)
function generateMockData(id) {
  const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  const uptime = seed % 5 === 0 ? 99.79 + (seed % 3) * 0.07 : 100;
  const ping = 8 + (seed * 13) % 120;
  const history = Array.from({ length: 60 }, (_, i) => {
    const s = (seed + i * 7) % 100;
    return s < 3 ? "down" : s < 6 ? "degraded" : "up";
  });
  return { uptime, ping, history, status: "operational" };
}

const STATUS_COLOR = {
  operational: "#22c55e",
  degraded: "#f59e0b",
  down: "#ef4444",
};

const BAR_COLOR = {
  up: "#22c55e",
  degraded: "#f59e0b",
  down: "#ef4444",
};

function UptimeBar({ history }) {
  return (
    <div style={{ display: "flex", gap: 2, height: 20, alignItems: "flex-end" }}>
      {history.map((state, i) => (
        <div
          key={i}
          title={state}
          style={{
            flex: 1,
            height: state === "up" ? 20 : state === "degraded" ? 14 : 8,
            background: BAR_COLOR[state],
            borderRadius: 2,
            opacity: 0.85,
            transition: "height 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

function ServiceCard({ name, url, data, icon }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12,
      padding: "18px 20px",
      marginBottom: 10,
      transition: "border-color 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,174,0,0.25)"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#f0f0f0", fontFamily: "'Space Mono', monospace" }}>{name}</div>
            {url && <div style={{ fontSize: 11, color: "#666", marginTop: 1 }}>{url}</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#888", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
            <span>⏱</span> {data.ping}ms
          </span>
          <div style={{
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: STATUS_COLOR.operational,
            fontSize: 12,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR.operational, display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
            Operational
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, marginTop: 8 }}>
        <span style={{ fontSize: 11, color: "#555" }}>Last checked 1 minute ago</span>
        <span style={{ fontSize: 11, color: "#666" }}>{data.uptime}% uptime</span>
      </div>
      <UptimeBar history={data.history} />
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      borderLeft: "3px solid #ffae00",
      paddingLeft: 12,
      marginBottom: 14,
      marginTop: 28,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#f0f0f0", letterSpacing: "0.04em", textTransform: "uppercase" }}>{title}</h2>
    </div>
  );
}

function CountdownRing({ seconds, total }) {
  const r = 22;
  const circumference = 2 * Math.PI * r;
  const progress = circumference - (seconds / total) * circumference;
  return (
    <svg width={54} height={54} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={27} cy={27} r={r} fill="none" stroke="rgba(255,174,0,0.12)" strokeWidth={3} />
      <circle
        cx={27} cy={27} r={r}
        fill="none"
        stroke="#ffae00"
        strokeWidth={3}
        strokeDasharray={circumference}
        strokeDashoffset={progress}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      <text
        x={27} y={31}
        textAnchor="middle"
        fill="#ffae00"
        fontSize={12}
        fontWeight={700}
        fontFamily="'Space Mono', monospace"
        style={{ transform: "rotate(90deg)", transformOrigin: "27px 27px" }}
      >
        {seconds}s
      </text>
    </svg>
  );
}

export default function StatusPage() {
  const [countdown, setCountdown] = useState(CONFIG.refreshInterval);
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setTick(t => t + 1);
          return CONFIG.refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getData = useCallback((id) => generateMockData(id + tick), [tick]);

  const allOk = true;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d0f",
      color: "#e0e0e0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      backgroundImage: "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(255,174,0,0.06) 0%, transparent 70%)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(13,13,15,0.85)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, #ffae00, #ff6a00)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 14, color: "#000", fontFamily: "'Space Mono', monospace",
          }}>H</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>
            <span style={{ color: "#ffae00" }}>Hector</span> Hosting Status
          </span>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "5px 14px",
          fontSize: 12,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#ccc",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 8px #22c55e" }} />
          Status
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 60px" }}>
        {/* HERO */}
        <div style={{ textAlign: "center", padding: "48px 0 32px" }}>
          <h1 style={{
            fontSize: "clamp(32px, 7vw, 52px)",
            fontWeight: 800,
            margin: "0 0 10px",
            letterSpacing: "-0.02em",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <span style={{ color: "#fff" }}>Hector Hosting </span>
            <span style={{ color: "#ffae00" }}>Status</span>
            <span style={{ color: "#fff" }}> Page</span>
          </h1>
          <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px" }}>
            Current status for all monitored services and infrastructure.
          </p>

          {/* ALL OK BANNER */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(34,197,94,0.07)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 12,
            padding: "14px 24px",
            marginBottom: 20,
            width: "100%",
            maxWidth: 500,
          }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: "50%",
              background: "rgba(34,197,94,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}>✓</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#22c55e" }}>All Systems Operational</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Everything is running smoothly without any issues.</div>
            </div>
          </div>

          {/* COUNTDOWN */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 8 }}>
            <CountdownRing seconds={countdown} total={CONFIG.refreshInterval} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12, color: "#555" }}>Next update in</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, color: "#ffae00" }}>{countdown}s</div>
            </div>
          </div>
        </div>

        {/* WEBSITES */}
        <SectionHeader icon="🌐" title="Websites" />
        {CONFIG.websites.map(site => (
          <ServiceCard key={site.id} name={site.name} url={site.url} data={getData(site.id)} icon="🌐" />
        ))}

        {/* FREE NODES */}
        <SectionHeader icon="🖥" title="Free Nodes" />
        {CONFIG.freeNodes.map(node => (
          <ServiceCard key={node.id} name={node.name} data={getData(node.id)} icon="🖥" />
        ))}

        {/* PAID NODES */}
        <SectionHeader icon="⭐" title="Paid Nodes" />
        {CONFIG.paidNodes.map(node => (
          <ServiceCard key={node.id} name={node.name} data={getData(node.id)} icon="⭐" />
        ))}

        <div style={{ textAlign: "center", marginTop: 48, color: "#444", fontSize: 12 }}>
          © 2026 Hector Hosting Status Page. All systems monitored in real-time.
        </div>
      </div>
    </div>
  );
}
