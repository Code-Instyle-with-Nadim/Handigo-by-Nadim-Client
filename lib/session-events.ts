export const SESSION_UPDATED_EVENT = "handigo:session-updated"

export function notifySessionUpdated() {
  if (typeof window === "undefined") return

  window.dispatchEvent(new Event(SESSION_UPDATED_EVENT))
}
