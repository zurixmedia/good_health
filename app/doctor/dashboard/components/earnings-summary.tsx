import { formatCurrency } from "./format";

type EarningsSummaryProps = {
  earnings: {
    todayCount: number;
    weekCount: number;
    monthCount: number;
    totalCount: number;
    todayAmount: number;
    weekAmount: number;
    monthAmount: number;
    totalAmount: number;
  };
};

type Stat = {
  label: string;
  amount: number;
  count: number;
  period: string;
};

/**
 * EarningsSummary
 * Grid of earnings stat cards derived from completed consultations.
 */
export function EarningsSummary({ earnings }: EarningsSummaryProps) {
  const stats: Stat[] = [
    {
      label: "Today",
      amount: earnings.todayAmount,
      count: earnings.todayCount,
      period: "completed today",
    },
    {
      label: "This Week",
      amount: earnings.weekAmount,
      count: earnings.weekCount,
      period: "this week",
    },
    {
      label: "This Month",
      amount: earnings.monthAmount,
      count: earnings.monthCount,
      period: "this month",
    },
    {
      label: "All Time",
      amount: earnings.totalAmount,
      count: earnings.totalCount,
      period: "total consultations",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-[#eeece8] bg-white p-4 flex flex-col gap-1"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9b9b9b]">
            {stat.label}
          </span>
          <span className="text-xl font-bold text-[#1a1a1a] lg:text-2xl">
            {formatCurrency(stat.amount)}
          </span>
          <span className="text-xs text-[#6b6b6b]">
            {stat.count} {stat.period}
          </span>
        </div>
      ))}
    </div>
  );
}
