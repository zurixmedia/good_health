import Link from "next/link";
import { formatNotificationDate } from "./format";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

type NotificationsSectionProps = {
  notifications: Notification[];
};

/**
 * NotificationsSection
 * Timeline list of recent notifications for the doctor.
 */
export function NotificationsSection({
  notifications,
}: NotificationsSectionProps) {
  return (
    <div className="rounded-2xl border border-[#eeece8] bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-[#1a1a1a]">Recent Notifications</h3>
        <Link
          href="/doctor/dashboard#notifications"
          className="text-sm font-semibold text-[#2641FF] hover:underline"
        >
          View all
        </Link>
      </div>

      {notifications.length === 0 ? (
        <p className="py-6 text-center text-sm text-[#9b9b9b]">
          No notifications yet.
        </p>
      ) : (
        <ul className="space-y-0" role="list" aria-label="Notifications list">
          {notifications.map((notif, i) => (
            <li key={notif.id}>
              <div className="flex gap-3 py-3">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1 h-3 w-3 rounded-full border-2 flex-shrink-0 ${
                      notif.isRead
                        ? "border-[#d0d0d0] bg-white"
                        : "border-[#2641FF] bg-[#eef0ff]"
                    }`}
                  />
                  {i < notifications.length - 1 && (
                    <span className="mt-1 flex-1 w-px border-l-2 border-dashed border-[#2641FF]/30 min-h-[28px]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-2 min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    {notif.title}
                  </p>
                  <p className="mt-0.5 text-sm text-[#6b6b6b] leading-snug">
                    {notif.message}
                  </p>
                  <p className="mt-1 text-xs text-[#9b9b9b]">
                    {formatNotificationDate(notif.createdAt)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
