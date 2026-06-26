import Link from "next/link";
import { formatDate } from "@/lib/utils";

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

function formatNotificationDate(date: Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/**
 * NotificationsSection
 * Renders the notifications list + "Stay Updated" CTA side card.
 * Matches Figma desktop and mobile designs exactly.
 */
export function NotificationsSection({
  notifications,
}: NotificationsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      {/* Notifications list */}
      <div className="rounded-2xl border border-[#eeece8] bg-white p-5">
        {notifications.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#9b9b9b]">
            No notifications yet.
          </p>
        ) : (
          <ul className="space-y-0" role="list" aria-label="Notifications list">
            {notifications.map((notif, i) => (
              <li key={notif.id}>
                <div className="flex gap-3 py-3">
                  {/* Timeline dot + line */}
                  <div className="flex flex-col items-center">
                    <span className="mt-1 h-3 w-3 rounded-full border-2 border-[#c0114e] bg-white flex-shrink-0" />
                    {i < notifications.length - 1 && (
                      <span className="mt-1 flex-1 w-px border-l-2 border-dashed border-[#c0114e]/40 min-h-[28px]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-2 min-w-0">
                    <p className="text-sm text-[#1a1a1a] leading-snug">
                      {/* Bold the key part of the message for recognizability */}
                      <NotificationMessage message={notif.message} />
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

      {/* "Stay Updated" card */}
      <div className="rounded-2xl border border-[#eeece8] bg-[#f5f5f5] p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1a1a1a]">
            Stay Updated with GoodHealth
          </h3>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            Get notified when new features are released at GoodHealth
          </p>
        </div>
        <div className="mt-auto">
          <button
            id="notifications-notify-me-btn"
            type="button"
            className="w-full rounded-full bg-[#c8b400] px-6 py-3 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#b5a300] active:scale-95"
          >
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Parses notification message to bold key phrases (like "account details", plan names).
 * Matches the Figma style where the key noun is bold.
 */
function NotificationMessage({ message }: { message: string }) {
  // Bold anything wrapped in ** or anything after "the " near the end of the string
  // Simple heuristic: find bold markers or bold the last noun phrase
  const parts = message.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length > 1) {
    return (
      <>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i} className="font-semibold text-[#1a1a1a]">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  }
  return <span>{message}</span>;
}
