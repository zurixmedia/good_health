"use client";

import React, { useState, useTransition, useMemo } from "react";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";
import {
  type PatientNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "./actions";
import { cn } from "@/lib/utils";

type Props = {
  initialNotifications: PatientNotification[];
  user: PatientUser;
};

function timeAgo(dateInput: Date | string) {
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NotificationsPageClient({ initialNotifications, user }: Props) {
  const [notifications, setNotifications] = useState<PatientNotification[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (activeFilter === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, activeFilter]);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    startTransition(async () => {
      await markNotificationRead(id);
    });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    startTransition(async () => {
      await markAllNotificationsRead();
    });
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    startTransition(async () => {
      await deleteNotification(id);
    });
  };

  return (
    <PatientShellClient user={user} title="Notifications">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Notifications</h1>
          <p className="text-sm text-[#6b6b6b]">Stay updated on appointments, platform changes, and messages.</p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            disabled={isPending}
            className="self-start rounded-full border border-[#eeece8] bg-white px-5 py-2 text-xs font-semibold text-[#2641FF] shadow-sm transition hover:bg-[#f5f5f5] active:scale-95 disabled:opacity-60"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-[#eeece8]">
        <button
          onClick={() => setActiveFilter("all")}
          className={cn(
            "pb-3 text-sm font-semibold border-b-2 px-4 transition-all -mb-px",
            activeFilter === "all"
              ? "border-[#2641FF] text-[#2641FF]"
              : "border-transparent text-[#6b6b6b] hover:text-[#1a1a1a]",
          )}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter("unread")}
          className={cn(
            "pb-3 text-sm font-semibold border-b-2 px-4 transition-all -mb-px",
            activeFilter === "unread"
              ? "border-[#2641FF] text-[#2641FF]"
              : "border-transparent text-[#6b6b6b] hover:text-[#1a1a1a]",
          )}
        >
          Unread ({notifications.filter((n) => !n.isRead).length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#eeece8] bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf9f7]">
              <svg className="h-6 w-6 text-[#9b9b9b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="text-base font-bold text-[#1a1a1a]">All caught up!</p>
            <p className="text-xs text-[#6b6b6b] mt-1">You have no {activeFilter === "unread" && "unread"} notifications.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-2xl border p-5 bg-white transition hover:shadow-sm flex items-start gap-4 justify-between",
                !item.isRead ? "border-l-4 border-l-[#2641FF] border-[#eeece8]" : "border-[#eeece8]",
              )}
            >
              <div className="flex gap-4 min-w-0">
                {/* Icon wrapper */}
                <div
                  className={cn(
                    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
                    !item.isRead ? "bg-[#eef0ff] text-[#2641FF]" : "bg-[#faf9f7] text-[#9b9b9b]",
                  )}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={cn("text-sm font-bold text-[#1a1a1a]", !item.isRead ? "font-extrabold" : "")}>
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-[#9b9b9b]">{timeAgo(item.createdAt)}</span>
                  </div>
                  <p className="text-sm text-[#6b6b6b] mt-1 pr-4">{item.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!item.isRead && (
                  <button
                    onClick={() => handleMarkRead(item.id)}
                    title="Mark as read"
                    className="p-2 rounded-full border border-[#eeece8] hover:bg-[#faf9f7] text-[#9b9b9b] hover:text-[#2641FF] transition"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                  className="p-2 rounded-full border border-[#eeece8] hover:bg-red-50 text-[#9b9b9b] hover:text-red-600 transition"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </PatientShellClient>
  );
}
