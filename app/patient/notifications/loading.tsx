export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:px-8">
        <div className="h-10 w-56 animate-pulse rounded-full bg-slate-200" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
            <div className="space-y-3">
              <div className="h-24 animate-pulse rounded-3xl bg-slate-200" />
              <div className="h-24 animate-pulse rounded-3xl bg-slate-200" />
              <div className="h-24 animate-pulse rounded-3xl bg-slate-200" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
            <div className="h-40 animate-pulse rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

