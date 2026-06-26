export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:px-8">
        <div className="h-10 w-52 animate-pulse rounded-full bg-slate-200" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.75fr)]">
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-[360px] animate-pulse rounded-3xl bg-slate-200" />
          </div>
          <div className="space-y-4">
            <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
            <div className="h-32 animate-pulse rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

