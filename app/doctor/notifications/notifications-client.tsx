"use client";

import React, { useState, useTransition, useMemo } from "react";
import { DashboardShell } from "@/app/doctor/dashboard/components/dashboard-shell";
import {
  type DoctorNotification,
  markNotificationRead,
  markAllDoctorNotificationsRead,
  deleteNotification,
} from "./actions";
import { formatRelativeDate, formatNotificationDate } from "@/app/doctor/dashboard/components/format";
import { cn } from "@/lib/utils";

type Props = {
  notifications: DoctorNotification[];
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
  };
};

type FilterType = "all" | "unread" | "read";

export function NotificationsPageClient({ notifications: initialNotifications, user }: Props) {
  const [notifications, setNotifications] = useState<DoctorNotification[]>(initialNotifications);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isPending, startTransition] = useTransition();

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === "unread") return !n.isRead;
      if (filter === "read") return n.isRead;
      return true;
    });
  }, [notifications, filter]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      read: notifications.filter((n) => n.isRead).length,
    };
  }, [notifications]);

  // Actions
  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      const res = await markNotificationRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    });
  };

  const handleMarkAllAsRead = () => {
    if (counts.unread === 0) return;
    startTransition(async () => {
      const res = await markAllDoctorNotificationsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteNotification(id);
      if (res.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    });
  };

  // Helper for notification type icons
  const getIcon = (type: string) => {
    switch (type) {
      case "APPOINTMENT":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        );
      case "MEMBERSHIP":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        );
      case "SYSTEM":
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
        );
    }
  };

  return (
    <DashboardShell user={user}>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Notifications</h1>
          <p className="text-sm text-[#6b6b6b]">Stay updated on appointments, platform changes, and membership alerts.</p>
        </div>
        {counts.unread > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="self-start rounded-full border border-[#eeece8] bg-white px-5 py-2.5 text-xs font-semibold text-[#2641FF] shadow-sm transition hover:bg-[#eef0ff] hover:border-[#2641FF]/30 disabled:opacity-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs / Filters */}
      <div className="mb-6 flex border-b border-[#eeece8]">
        {(["all", "unread", "read"] as FilterType[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "border-b-2 px-6 py-3 text-sm font-semibold capitalize transition -mb-px",
              filter === t
                ? "border-[#2641FF] text-[#2641FF]"
                : "border-transparent text-[#6b6b6b] hover:text-[#1a1a1a]"
            )}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      {/* List */}
      {filteredNotifications.length === 0 ? (
        <div className="rounded-2xl border border-[#eeece8] bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#faf9f7]">
            <svg className="h-8 w-8 text-[#d1d5db]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <p className="text-base font-semibold text-[#1a1a1a]">No notifications</p>
          <p className="text-sm text-[#9b9b9b] mt-1">
            You don't have any {filter !== "all" ? `${filter} ` : ""}notifications right now.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#eeece8] rounded-2xl border border-[#eeece8] bg-white overflow-hidden">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "group flex gap-4 p-5 transition hover:bg-[#faf9f7]",
                !n.isRead && "bg-[#2641FF]/[0.02]"
              )}
            >
              {/* Type Icon */}
              <div className="flex-shrink-0">{getIcon(n.type)}</div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                  <h3 className={cn("text-sm font-semibold text-[#1a1a1a]", !n.isRead && "font-bold")}>
                    {n.title}
                  </h3>
                  <span
                    className="text-[11px] text-[#9b9b9b]"
                    title={formatNotificationDate(n.createdAt)}
                  >
                    {formatRelativeDate(n.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#6b6b6b] leading-relaxed">{n.message}</p>
                <div className="mt-3 flex items-center gap-3">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-xs font-semibold text-[#2641FF] hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-xs font-semibold text-red-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
