export default function DashboardLoading() {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-12 w-40 bg-slate-200 rounded-xl animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 h-32 animate-pulse shadow-sm shadow-slate-200/20" />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 h-[500px] animate-pulse shadow-sm shadow-slate-200/20">
         <div className="space-y-6">
            <div className="h-8 w-1/4 bg-slate-100 rounded-lg" />
            <div className="space-y-4">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="h-12 w-full bg-slate-50 rounded-xl" />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
