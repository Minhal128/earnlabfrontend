export const LIVE_CHAT_OPEN_EVENT = "labwards:open-live-chat";

export const openLiveChatPanel = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LIVE_CHAT_OPEN_EVENT));
};
