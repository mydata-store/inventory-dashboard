INVENTORY ERP V41 — UNIVERSAL CORE, OFFLINE BACKUP & HOST FOUNDATION

What is added
1. One universal ERP runtime loaded by every HTML page in this framework.
2. Published settings package with draft, publish, history and rollback foundation.
3. Offline-first IndexedDB record store and online/offline status indicator.
4. Service worker + web app manifest for cached/offline page access.
5. Excel-compatible .xls backup engine using a user-selected computer folder.
6. Emergency full JSON backup download.
7. Host Computer Manager supporting Single-PC and future Office Host modes.
8. Runtime modules are registered independently, so future Design Studio controllers/plugins can be added without rewriting every page.
9. Active Profile runtime reads erp_profile_controller_v1 and applies the active profile to universal sidebar cards.
10. Theme runtime applies the currently saved global theme.

Start here
- Open host-manager.html.
- Choose the computer backup folder in Chrome or Edge.
- Save and Publish Host Settings.
- Use Create Test Local Record, then Backup Everything Now.

Important browser security rule
A website cannot silently access D:\ or another folder. The user must select the folder and may need to grant permission again after restarting the browser. This is intentional browser security.

Current phase
V41 is the common foundation. Next, connect and test the Dashboard as the first operational transaction page, then update pages one-by-one while keeping the same core files.
