// ─────────────────────────────────────────────────────────
//  SpinnerOverlay — Full-page loading spinner
//  Used while auth/user state is being checked
// ─────────────────────────────────────────────────────────
export default function SpinnerOverlay() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "4px solid rgba(201,151,59,0.2)",
          borderTopColor: "var(--gold)",
          animation: "spin 1s linear infinite",
          display: "inline-block",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
