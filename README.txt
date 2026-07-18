Framework V28 — Arrow Strip Removal

This update changes only the remaining arrow-strip problem.

Cause:
The :<|>: strip above the bottom profile was the browser's horizontal
scrollbar control inside the sidebar navigation. It was not the profile
card or the manual collapse button.

Fix:
- Horizontal sidebar overflow is disabled.
- Horizontal scrollbar controls are hidden.
- Sidebar vertical scrolling remains available.
- Universal profile markup is corrected.
- No page layout, theme, profile position, or hover behavior is changed.

Install:
1. Replace public/common.css.
2. Replace public/common-shell-engine.js.
3. Refresh using Ctrl+Shift+R.
No SQL is required.
