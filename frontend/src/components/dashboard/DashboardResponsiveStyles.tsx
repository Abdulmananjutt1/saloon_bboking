export function DashboardResponsiveStyles() {
  return (
    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes clientPulse { 0%, 100% { opacity: 0.95; } 50% { opacity: 0.45; } }
      .client-mobile-header,
      .client-mobile-overlay {
        display: none;
      }
      @media (max-width: 768px) {
        .client-dashboard-shell {
          display: block !important;
        }
        .client-dashboard-sidebar {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          bottom: 0 !important;
          z-index: 60 !important;
          width: min(82vw, 300px) !important;
          height: 100dvh !important;
          transform: translateX(-100%);
          transition: transform 0.24s ease;
          box-shadow: 20px 0 45px rgba(0,0,0,0.28);
        }
        .client-dashboard-sidebar-open {
          transform: translateX(0);
        }
        .client-mobile-overlay {
          display: block;
          position: fixed;
          inset: 0;
          z-index: 50;
          border: 0;
          background: rgba(13, 12, 10, 0.45);
          backdrop-filter: blur(2px);
        }
        .client-mobile-header {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-bottom: 1px solid var(--border-light);
          background: var(--bg-secondary);
          position: sticky;
          top: 0;
          z-index: 30;
        }
        .client-mobile-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--text-primary);
          text-decoration: none;
          font-size: 0.86rem;
          font-weight: 800;
        }
        .client-mobile-menu-button {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(201,151,59,0.22);
          background: rgba(201,151,59,0.08);
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .client-dashboard-main {
          padding: 16px !important;
          height: calc(100dvh - 64px);
        }
        .client-dashboard-page-head {
          align-items: flex-start !important;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px !important;
        }
        .client-dashboard-page-head h1 {
          font-size: 1.85rem !important;
        }
        .client-dashboard-page-head a {
          width: 100%;
          justify-content: center;
        }
        .client-stat-grid,
        .client-overview-grid {
          grid-template-columns: 1fr !important;
        }
        .client-stat-grid {
          margin-bottom: 28px !important;
        }
      }
    `}</style>
  );
}
