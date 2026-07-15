(() => {
  "use strict";

  const SUPABASE_URL = "https://lzsxtvkluqvcaetnnydu.supabase.co";
  const SUPABASE_KEY = "sb_publishable_QfemUy-S0bO7fy6-uL_jBA_ZzGXKgma";

  const DEFAULTS = {
    navigationPosition: "left",
    startupPage: "index.html",
    stickyNavigation: true,
    compactTopBar: false,
    showBrand: true,
    brandTitle: "Inventory Store",
    brandSubtitle: "Management System",
    showSearch: false,
    showDateTime: true,
    showNotifications: true,
    sidebarWidth: 170,
    sidebarCollapsedWidth: 58,
    sidebarDefaultCollapsed: false,
    profileVisible: true,
    profilePosition: "left-bottom",
    profileLayout: "vertical",
    profileMode: "compact",
    profileName: "Muhammad Waqas",
    profileDesignation: "Store Officer",
    profileDepartment: "Store Department",
    profileStatusText: "Online",
    profileStatusColor: "#22c55e",
    profileImage: "public/waqas.jpg.png",
    profileImageSize: 50,
    profileImageShape: "circle",
    profileCardWidth: 150,
    profileCardHeight: 92,
    profileCardBackground: "#5b2b18",
    profileTextColor: "#ffffff",
    profileRadius: 12,
    profileShadow: true,
    profileShowDesignation: false,
    profileShowDepartment: false,
    profileShowStatus: true,
    profileHideMobile: false,
    topBarHeight: 64,
    topBarBackground: "#0f172a",
    topBarTextColor: "#ffffff",
    activeColor: "#f59e0b"
  };

  const MENU = [
    { label: "Dashboard", icon: "⌂", href: "index.html" },
    { id: "masters", label: "Masters", icon: "▦", children: [
      { label: "Item Master", href: "items.html" },
      { label: "Supplier Master", href: "suppliers.html" },
      { label: "Workshop / Party", href: "workshops.html" },
      { label: "Department Master", href: "departments.html" },
      { label: "Other Masters Center", href: "master-center.html" }
    ]},
    { id: "purchase", label: "Purchase Entry", icon: "🛒", children: [
      { label: "Local Purchase", href: "local-purchase.html" },
      { label: "Zafar Purchase", href: "zafar-purchase.html" },
      { label: "Board Purchase", href: "board-purchase.html" },
      { label: "Purchase List", href: "purchase-list.html" }
    ]},
    { label: "Issue Entry", icon: "↩", href: "issue.html" },
    { id: "gatepass", label: "Gate Pass", icon: "▣", children: [
      { label: "RGP Entry", href: "rgp-entry.html" },
      { label: "RGP Return", href: "rgp-return.html" },
      { label: "RGP List", href: "rgp-list.html" },
      { label: "OGP Entry", href: "ogp-entry.html" },
      { label: "OGP List", href: "ogp-list.html" }
    ]},
    { label: "Stock Ledger", icon: "▤", href: "stock-ledger.html" },
    { label: "Rack Management", icon: "▥", href: "rack-management.html" },
    { label: "Inventory Intelligence", icon: "◆", href: "inventory-intelligence.html" },
    { label: "Reports", icon: "▧", href: "reports.html" },
    { id: "settings", label: "Settings", icon: "⚙", children: [
      { label: "ERP Design Studio", href: "erp-design-studio.html" },
      { label: "Theme Settings", href: "theme-settings.html" },
      { label: "PDF & Logo Settings", href: "pdf-settings.html" },
      { label: "ERP Core Settings", href: "erp-core-settings.html" },
      { label: "Relationship Center", href: "erp-relationship-center.html" },
      { label: "Data Health Center", href: "erp-health-center.html" },
      { label: "Health Control Tower", href: "erp-health-control-tower.html" }
    ]}
  ];

  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function currentKey() {
    return (location.pathname.split("/").pop() || "index.html") + location.search;
  }

  function matches(item) {
    const key = currentKey();
    const href = item.href || "";
    return key === href || key.startsWith(href + "?") ||
      (href.includes("?") && key.startsWith(href.split("?")[0]));
  }

  function ensureHosts() {
    let sidebar = document.getElementById("appSidebar");
    if (!sidebar) {
      sidebar = document.createElement("div");
      sidebar.id = "appSidebar";
      document.body.insertBefore(sidebar, document.body.firstChild);
    }

    let top = document.getElementById("appTopNavigation");
    if (!top) {
      top = document.createElement("div");
      top.id = "appTopNavigation";
      document.body.insertBefore(top, document.body.firstChild);
    }

    const main = document.querySelector(".app-main, main");
    if (main && !main.classList.contains("app-main")) main.classList.add("app-main");
    return { sidebar, top };
  }

  function profile(settings, where) {
    if (!settings.profileVisible) return "";
    if (where === "top" && !String(settings.profilePosition).startsWith("top")) return "";
    if (where === "left" && !String(settings.profilePosition).startsWith("left")) return "";

    const info = [];
    if (settings.profileShowDesignation && settings.profileDesignation) info.push(settings.profileDesignation);
    if (settings.profileShowDepartment && settings.profileDepartment) info.push(settings.profileDepartment);

    return `<div class="erp-universal-profile ${settings.profileLayout === "vertical" ? "vertical" : ""}"
      style="--p-bg:${settings.profileCardBackground};--p-color:${settings.profileTextColor};
      --p-radius:${Number(settings.profileRadius || 12)}px;--p-width:${Number(settings.profileCardWidth || 150)}px;
      --p-height:${Number(settings.profileCardHeight || 70)}px;--p-img:${Number(settings.profileImageSize || 44)}px">
      <img src="${esc(settings.profileImage)}" onerror="this.src='public/profile.png'">
      <span><strong>${esc(settings.profileName)}</strong>
      ${info.length ? `<small>${esc(info.join(" • "))}</small>` : ""}
      ${settings.profileShowStatus ? `<em><i style="background:${esc(settings.profileStatusColor)}"></i>${esc(settings.profileStatusText)}</em>` : ""}
      </span>
    </div>`;
  }

  function brand(settings) {
    if (!settings.showBrand) return "";
    return `<a class="erp-universal-brand" href="${esc(settings.startupPage || "index.html")}">
      <b>ERP</b><span><strong>${esc(settings.brandTitle)}</strong><small>${esc(settings.brandSubtitle)}</small></span>
    </a>`;
  }

  function sideMenu() {
    return MENU.map((item, index) => {
      if (!item.children) {
        return `<a class="erp-side-item ${matches(item) ? "active" : ""}" href="${item.href}">
          <b>${item.icon}</b><span>${esc(item.label)}</span></a>`;
      }
      const open = item.children.some(matches);
      const id = `erpSideGroup_${item.id || index}`;
      return `<div class="erp-side-group ${open ? "open" : ""}" id="${id}">
        <button type="button" onclick="window.ERPUniversalShell.toggleSide('${id}')">
          <span><b>${item.icon}</b><i>${esc(item.label)}</i></span><em>⌃</em>
        </button>
        <div>${item.children.map(child => `<a class="${matches(child) ? "active" : ""}" href="${child.href}">${esc(child.label)}</a>`).join("")}</div>
      </div>`;
    }).join("");
  }

  function topMenu() {
    return MENU.map((item, index) => {
      if (!item.children) {
        return `<a class="erp-top-item ${matches(item) ? "active" : ""}" href="${item.href}">
          <b>${item.icon}</b><span>${esc(item.label)}</span></a>`;
      }
      const current = item.children.some(matches);
      const id = `erpTopGroup_${item.id || index}`;
      return `<div class="erp-top-group ${current ? "current" : ""}" id="${id}">
        <button type="button" onclick="window.ERPUniversalShell.toggleTop('${id}',event)">
          <b>${item.icon}</b><span>${esc(item.label)}</span><i>⌄</i>
        </button>
        <div>${item.children.map(child => `<a class="${matches(child) ? "active" : ""}" href="${child.href}">${esc(child.label)}</a>`).join("")}</div>
      </div>`;
    }).join("");
  }

  function render(settings) {
    const s = { ...DEFAULTS, ...settings };
    const { sidebar, top } = ensureHosts();

    document.body.classList.remove("erp-shell-top", "erp-shell-left", "erp-shell-hybrid", "erp-shell-collapsed");
    document.body.classList.add(`erp-shell-${s.navigationPosition || "left"}`);

    document.documentElement.style.setProperty("--erp-side-width", `${Number(s.sidebarWidth || 170)}px`);
    document.documentElement.style.setProperty("--erp-side-collapsed", `${Number(s.sidebarCollapsedWidth || 58)}px`);
    document.documentElement.style.setProperty("--erp-top-height", `${Number(s.topBarHeight || 64)}px`);
    document.documentElement.style.setProperty("--erp-shell-bg", s.topBarBackground || "#0f172a");
    document.documentElement.style.setProperty("--erp-shell-text", s.topBarTextColor || "#ffffff");
    document.documentElement.style.setProperty("--erp-shell-active", s.activeColor || "#f59e0b");

    top.innerHTML = "";
    sidebar.innerHTML = "";

    if (["top", "hybrid"].includes(s.navigationPosition)) {
      top.innerHTML = `<header class="erp-universal-top ${s.compactTopBar ? "compact" : ""}">
        <div class="erp-universal-top-left">${profile(s, "top")}${brand(s)}</div>
        <nav>${topMenu()}</nav>
        <div class="erp-universal-top-right">
          ${s.showDateTime ? `<span><strong>${new Date().toLocaleDateString("en-PK", {day:"2-digit",month:"short",year:"2-digit"})}</strong><small>${new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</small></span>` : ""}
          ${s.showNotifications ? `<button title="Notifications">🔔</button>` : ""}
        </div>
      </header>`;
    }

    if (["left", "hybrid"].includes(s.navigationPosition)) {
      sidebar.innerHTML = `<aside class="erp-universal-side ${s.sidebarDefaultCollapsed ? "collapsed" : ""}">
        ${profile(s, "left-top")}
        ${brand(s)}
        <nav>${sideMenu()}</nav>
        ${profile(s, "left-bottom")}
        <button class="erp-side-collapse" onclick="window.ERPUniversalShell.toggleCollapse()">⇔</button>
      </aside>`;
    }

    requestAnimationFrame(() => {
      const topHeight = document.querySelector(".erp-universal-top")?.offsetHeight || 0;
      document.documentElement.style.setProperty("--erp-live-top-height", `${topHeight}px`);
    });
  }

  function getLocal() {
    let shell = {};
    try { shell = JSON.parse(localStorage.getItem("erp_shell_settings_v1") || "{}"); } catch {}
    return { ...DEFAULTS, ...shell };
  }

  async function getRemote() {
    if (!window.supabase) return null;
    try {
      const db = window.db || window.supabaseClient ||
        supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await db.from("erp_shell_settings")
        .select("settings_json").eq("setting_key", "global").maybeSingle();
      if (error) throw error;
      return data?.settings_json || null;
    } catch (error) {
      console.warn("Universal ERP shell:", error.message);
      return null;
    }
  }

  async function init() {
    render(getLocal());
    const remote = await getRemote();
    if (remote) {
      const merged = { ...getLocal(), ...remote };
      localStorage.setItem("erp_shell_settings_v1", JSON.stringify(merged));
      render(merged);
    }
  }

  window.ERPUniversalShell = {
    init,
    render,
    toggleSide(id) {
      const target = document.getElementById(id);
      if (!target) return;
      const opening = !target.classList.contains("open");
      document.querySelectorAll(".erp-side-group.open").forEach(el => {
        if (el !== target) el.classList.remove("open");
      });
      target.classList.toggle("open", opening);
    },
    toggleTop(id, event) {
      event?.stopPropagation();
      const target = document.getElementById(id);
      if (!target) return;
      const opening = !target.classList.contains("open");
      document.querySelectorAll(".erp-top-group.open").forEach(el => {
        if (el !== target) el.classList.remove("open");
      });
      target.classList.toggle("open", opening);
    },
    toggleCollapse() {
      document.querySelector(".erp-universal-side")?.classList.toggle("collapsed");
      document.body.classList.toggle("erp-shell-collapsed");
    }
  };

  document.addEventListener("click", event => {
    if (!event.target.closest(".erp-top-group")) {
      document.querySelectorAll(".erp-top-group.open").forEach(el => el.classList.remove("open"));
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.addEventListener("erp-shell-settings-changed", event => render(event.detail || getLocal()));
})();
