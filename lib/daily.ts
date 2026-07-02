import "server-only";

/**
 * Minimal server-side Daily.co REST client.
 *
 * Room provisioning and meeting-token minting happen on the server (using the
 * `DAILY_API_KEY`), while the actual video call is handled in the browser by
 * `@daily-co/daily-js` (see `DailyCallView`).
 *
 * Docs: https://docs.daily.co/reference/rest-api
 */

const DAILY_API_BASE = "https://api.daily.co/v1";
const DAILY_DOMAIN = process.env.DAILY_DOMAIN; // e.g. "goodhealth.daily.co"

export type DailyRoom = {
  id: string;
  name: string;
  url: string;
  privacy: "private" | "public";
};

export type DailyMeetingToken = {
  token: string;
};

function getApiKey(): string {
  const key = process.env.DAILY_API_KEY;
  if (!key) {
    throw new Error(
      "DAILY_API_KEY is not set. Add it to .env to enable video consultations.",
    );
  }
  return key;
}

function getDomain(): string {
  if (!DAILY_DOMAIN) {
    throw new Error(
      "DAILY_DOMAIN is not set. Add your Daily.co domain to .env (e.g. goodhealth.daily.co).",
    );
  }
  return DAILY_DOMAIN;
}

async function dailyFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${DAILY_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Daily.co request failed: ${response.status} ${response.statusText} — ${detail}`,
    );
  }

  // 204 No Content / empty bodies.
  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

/**
 * Deterministic room name for a consultation so repeat calls are idempotent.
 * Daily room names must match ^[a-z0-9][-a-z0-9]* and be <= 41 chars.
 */
function buildRoomName(appointmentId: string): string {
  const slug = appointmentId.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  return `gh-apt-${slug}`.slice(0, 41);
}

/**
 * Creates a private Daily.co room for an appointment, or returns the existing
 * one if it has already been created. Private rooms require a meeting token
 * to join, which is what keeps consultations restricted to assigned participants.
 */
export async function ensureRoomForAppointment(
  appointmentId: string,
): Promise<DailyRoom> {
  const name = buildRoomName(appointmentId);
  const domain = getDomain();

  // Try to fetch the room first — this makes the operation idempotent so a
  // second "join" attempt doesn't error on a duplicate room name.
  try {
    const existing = await dailyFetch<DailyRoom>(`/rooms/${name}`);
    return {
      ...existing,
      url: `https://${domain}.daily.co/${name}`,
    };
  } catch {
    // 404 means "doesn't exist yet" — fall through to create it.
  }

  const created = await dailyFetch<{ name: string; id: string } & Record<
    string,
    unknown
  >>("/rooms", {
    method: "POST",
    body: JSON.stringify({
      name,
      privacy: "private",
      properties: {
        // Two-participant consultation: enable features that make sense for
        // clinical video, keep rooms short-lived after the call.
        enable_screenshare: true,
        enable_chat: true,
        enable_recording: "cloud",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
        nbf: Math.floor(Date.now() / 1000),
        max_participants: 2,
        eject_at_room_exp: true,
      },
    }),
  });

  return {
    id: created.id,
    name: created.name,
    url: `https://${domain}.daily.co/${name}`,
    privacy: "private",
  };
}

/**
 * Mints a short-lived meeting token scoped to a single room and a specific
 * participant name. Required because consultation rooms are private.
 */
export async function createMeetingToken(params: {
  roomName: string;
  participantName: string;
  isOwner?: boolean;
}): Promise<DailyMeetingToken> {
  const { roomName, participantName, isOwner = false } = params;

  const result = await dailyFetch<{ token: string } & Record<string, unknown>>(
    "/meeting-tokens",
    {
      method: "POST",
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_name: participantName,
          is_owner: isOwner,
          enable_screenshare: true,
          enable_recording: "cloud",
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4, // 4h
        },
      }),
    },
  );

  return { token: result.token };
}

/**
 * Deletes a Daily.co room. Called when a consultation completes so we don't
 * accumulate stale rooms. Failures are non-fatal — the room will expire on its
 * own via the `exp` property set at creation.
 */
export async function deleteRoom(roomName: string): Promise<void> {
  try {
    await dailyFetch(`/rooms/${roomName}`, { method: "DELETE" });
  } catch (error) {
    console.error("[daily] deleteRoom failed (non-fatal)", error);
  }
}
