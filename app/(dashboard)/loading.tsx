export default function DashboardLoading() {
  return <div className="dashboardLoading" role="status" aria-live="polite"><span className="srOnly">Loading your quest</span><div className="skeleton skeletonTitle"/><div className="skeletonGrid"><div className="skeleton skeletonPanel"/><div className="skeleton skeletonPanel"/></div></div>;
}
