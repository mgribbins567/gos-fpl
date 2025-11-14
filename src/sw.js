import { precacheAndRoute } from "workbox-precaching";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
precacheAndRoute(self.__SW_MANIFEST);
