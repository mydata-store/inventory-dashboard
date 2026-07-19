(() => {
  "use strict";

  const SETTINGS_KEY = "erp_shell_settings_v1";
  const REGISTRY_KEY = "erp_module_registry";
  let currentSettings = {};
  let hideTimer = null;
  let expandTimer = null;
  let shellState = "collapsed";

  const DEFAULTS = {
    navigationPosition: "left",
    startupPage: "index.html",
    sidebarWidth: 182,
    sidebarCollapsedWidth: 58,
    sidebarAutoHide: true,
    sidebarAutoHideDelay: 1000,
    sidebarExpandDelay: 40,
    sidebarCollapseDelay: 160,
    sidebarExpandOnHover: true,
    sidebarCollapseOnLeave: true,
    sidebarShowTooltips: true,
    sidebarRememberState: false,
    sidebarAnimationMs: 180,
    sidebarFontFamily: "Segoe UI, Arial, sans-serif",
    sidebarFontSize: 12,
    sidebarSubmenuFontSize: 11,
    sidebarLineHeight: 1.25,
    sidebarLetterSpacing: 0,
    sidebarTextTransform: "none",
    sidebarIconGap: 8,
    sidebarFontWeight: 600,
    sidebarIconSize: 15,
    menuIcons: {},
    showBrand: true,
    brandTitle: "Inventory Store",
    brandSubtitle: "Management System",
    profileVisible: true,
    profileSingleOnly: true,
    profilePosition: "left-bottom",
    profileName: "Muhammad Waqas",
    profileDesignation: "Store Officer",
    profileDepartment: "",
    profileStatusText: "Online",
    profileStatusColor: "#22c55e",
    profileImage: "public/waqas.jpg.png",
    profileImageSize: 48,
    profileImageShape: "circle",
    profileCardWidth: 160,
    profileCardHeight: 72,
    profileCardBackground: "#0f172a",
    profileTextColor: "#ffffff",
    profileRadius: 12,
    profileBorderStyle: "solid",
    profileBorderWidth: 1,
    profileBorderColor: "rgba(255,255,255,.08)",
    profileShadow: "soft",
    profileShowName: true,
    profileShowDesignation: false,
    profileShowDepartment: false,
    profileShowStatus: true,
    sidebarBackgroundType: "solid",
    sidebarBackground: "#0f172a",
    sidebarBackground2: "#173f5f",
    sidebarText: "#ffffff",
    sidebarIconColor: "#ffffff",
    hoverBackground: "#173f5f",
    hoverText: "#ffffff",
    activeBackground: "#f59e0b",
    activeText: "#111827",
    submenuActiveColor: "#f59e0b",
    borderColor: "#334155",
    tooltipBackground: "#0b1220",
    tooltipText: "#ffffff",
    sidebarOpacity: 1,
    sidebarBlur: 0,
    activeColor: "#f59e0b"
  };

  const BASE_MENU = [
    { id:"dashboard", label:"Dashboard", icon:"⌂", href:"index.html" },
    { id:"masters", label:"Masters", icon:"▦", children:[
      { label:"Item Master", href:"items.html" },
      { label:"Supplier Master", href:"suppliers.html" },
      { label:"Workshop / Party", href:"workshops.html" },
      { label:"Department Master", href:"departments.html" },
      { label:"All Masters", href:"masters.html" },
      { label:"Master Center", href:"master-center.html" }
    ]},
    { id:"purchase", label:"Purchase Entry", icon:"🛒", children:[
      { label:"Local Purchase", href:"local-purchase.html" },
      { label:"Zafar Purchase", href:"zafar-purchase.html" },
      { label:"Board Purchase", href:"board-purchase.html" },
      { label:"Purchase List", href:"purchase-list.html" }
    ]},
    { id:"issue", label:"Issue Entry", icon:"↩", href:"issue.html" },
    { id:"gatepass", label:"Gate Pass", icon:"▣", href:"gate-pass.html" },
    { id:"stockledger", label:"Stock Ledger", icon:"▤", href:"stock-ledger.html" },
    { id:"rack", label:"Rack Management", icon:"▥", href:"rack-management.html" },
    { id:"intelligence", label:"Inventory Intelligence", icon:"◆", href:"inventory-intelligence.html" },
    { id:"reports", label:"Reports", icon:"▧", href:"reports.html" },
    { id:"control", label:"ERP Control Center", icon:"⚙", children:[
      { label:"Control Center Dashboard", href:"erp-control-center.html" },
      { label:"ERP Design Studio", href:"erp-design-studio.html" },
      { label:"Host Manager", href:"host-manager.html" },
      { label:"Diagnostics", href:"erp-diagnostics.html" },
      { label:"Framework Status", href:"framework-status.html" },
      { label:"Plugin Manager", href:"erp-plugin-manager.html" },
      { label:"Activity Log", href:"erp-activity-log.html" },
      { label:"ERP Setup Wizard", href:"erp-installer.html" },
      { label:"ERP Core Settings", href:"erp-core-settings.html" },
      { label:"Theme Settings", href:"theme-settings.html" },
      { label:"PDF & Logo Settings", href:"pdf-settings.html" },
      { label:"Relationship Center", href:"erp-relationship-center.html" },
      { label:"Data Health Center", href:"erp-health-center.html" },
      { label:"Health Control Tower", href:"erp-health-control-tower.html" },
      { label:"ERP Launcher", href:"erp-launcher.html" }
    ]}
  ];

  const esc = value => String(value ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

  const currentFile = () => location.pathname.split("/").pop() || "index.html";

  function isActive(item) {
    const file = currentFile();
    if (!item.href) return false;
    const base = item.href.split("?")[0];
    return file === base || location.href.includes(item.href);
  }

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "");
      return value || fallback;
    } catch {
      return fallback;
    }
  }

  function getSettings() {
    return { ...DEFAULTS, ...readJSON(SETTINGS_KEY, {}) };
  }

  function getControlCenterChildren() {
    const fixed = BASE_MENU.find(item => item.id === "control").children.map(item => ({...item}));
    const seen = new Set(fixed.map(item => item.href));

    const registry = readJSON(REGISTRY_KEY, {});
    const records = Array.isArray(registry) ? registry : Object.values(registry || {});

    records.forEach(record => {
      if (!record || !record.url || seen.has(record.url)) return;
      const moduleName = String(record.module || "").toLowerCase();
      const pageId = String(record.id || "").toLowerCase();
      const isControlPage =
        moduleName === "framework" ||
        moduleName === "settings" ||
        pageId.includes("control") ||
        pageId.includes("diagnostic") ||
        pageId.includes("framework") ||
        pageId.includes("plugin") ||
        pageId.includes("activity") ||
        pageId.includes("installer") ||
        pageId.includes("health") ||
        pageId.includes("host");

      if (isControlPage) {
        fixed.push({
          label: record.title || record.id || record.url,
          href: record.url
        });
        seen.add(record.url);
      }
    });

    return fixed;
  }

  function getMenu() {
    return BASE_MENU.map(item => {
      if (item.id === "control") return {...item, children:getControlCenterChildren()};
      return {...item, children:item.children ? item.children.map(child => ({...child})) : undefined};
    });
  }

  function ensureHosts() {
    let sidebar = document.getElementById("appSidebar");
    if (!sidebar) {
      sidebar = document.createElement("div");
      sidebar.id = "appSidebar";
      document.body.insertBefore(sidebar, document.body.firstChild);
    }
    return sidebar;
  }

  function selectedIcon(item) {
    return (currentSettings.menuIcons || {})[item.id] || item.icon;
  }

  function brand() {
    if (currentSettings.showBrand === false) return "";
    return `<a class="erp-universal-brand" href="${esc(currentSettings.startupPage || "index.html")}">
      <b>ERP</b>
      <span><strong>${esc(currentSettings.brandTitle)}</strong><small>${esc(currentSettings.brandSubtitle)}</small></span>
    </a>`;
  }

  function profile() {
    if (currentSettings.profileVisible === false) return "";

    const info = [];
    if (currentSettings.profileShowDesignation && currentSettings.profileDesignation) {
      info.push(currentSettings.profileDesignation);
    }
    if (currentSettings.profileShowDepartment && currentSettings.profileDepartment) {
      info.push(currentSettings.profileDepartment);
    }

    const shape = String(currentSettings.profileImageShape || "circle").toLowerCase();
    const imageRadius = shape.includes("square") ? "10px" : "50%";

    const shadow=String(currentSettings.profileShadow||"soft").toLowerCase();
    return `<div class="erp-universal-profile profile-shadow-${esc(shadow)}" data-universal-profile="true"
      style="
        --profile-bg:${esc(currentSettings.profileCardBackground)};
        --profile-text:${esc(currentSettings.profileTextColor)};
        --profile-radius:${Number(currentSettings.profileRadius || 12)}px;
        --profile-card-height:${Number(currentSettings.profileCardHeight || 72)}px;
        --profile-image-size:${Number(currentSettings.profileImageSize || 48)}px;
        --profile-image-radius:${imageRadius};
        --profile-border-style:${esc(currentSettings.profileBorderStyle || "solid")};
        --profile-border-width:${Number(currentSettings.profileBorderWidth || 1)}px;
        --profile-border-color:${esc(currentSettings.profileBorderColor || "rgba(255,255,255,.08)")};
      ">
      <img src="${esc(currentSettings.profileImage)}" onerror="this.src='public/profile.png'">
      <span>
        ${currentSettings.profileShowName !== false ? `<strong>${esc(currentSettings.profileName)}</strong>` : ""}
        ${info.length ? `<small>${esc(info.join(" • "))}</small>` : ""}
        ${currentSettings.profileShowStatus !== false ? `<em><i style="background:${esc(currentSettings.profileStatusColor)}"></i>${esc(currentSettings.profileStatusText)}</em>` : ""}
      </span>
    </div>`;
  }

  function renderMenu() {
    return getMenu().map((item, index) => {
      const icon = selectedIcon(item);
      if (!item.children) {
        return `<a class="erp-side-item ${isActive(item) ? "active" : ""}"
          href="${esc(item.href)}" data-label="${esc(item.label)}">
          <b>${esc(icon)}</b><span>${esc(item.label)}</span>
        </a>`;
      }

      const childActive = item.children.some(isActive);
      const groupId = `erpSideGroup_${item.id || index}`;
      return `<div class="erp-side-group ${childActive ? "open" : ""}" id="${groupId}">
        <button type="button" data-group-id="${groupId}" data-label="${esc(item.label)}">
          <span><b>${esc(icon)}</b><i>${esc(item.label)}</i></span><em>⌃</em>
        </button>
        <div>
          ${item.children.map(child => `<a class="${isActive(child) ? "active" : ""}" href="${esc(child.href)}">${esc(child.label)}</a>`).join("")}
        </div>
      </div>`;
    }).join("");
  }

  function setCollapsed(collapsed) {
    const side = document.querySelector(".erp-universal-side");
    if (!side) return;
    shellState = collapsed ? "collapsed" : "expanded";
    side.dataset.shellState = shellState;
    side.classList.toggle("collapsed", !!collapsed);
    document.body.classList.toggle("erp-shell-collapsed", !!collapsed);
  }

  function clearHideTimer() {
    if (hideTimer) clearTimeout(hideTimer);
    if (expandTimer) clearTimeout(expandTimer);
    hideTimer = null;
    expandTimer = null;
  }

  function scheduleHide() {
    clearHideTimer();
    if (!currentSettings.sidebarAutoHide) return;
    hideTimer = setTimeout(() => {
      const side = document.querySelector(".erp-universal-side");
      if (!side || side.matches(":hover")) return;
      setCollapsed(true);
    }, Math.max(200, Number(currentSettings.sidebarAutoHideDelay || 1000)));
  }

  function closeOtherGroups(target) {
    document.querySelectorAll(".erp-side-group.open").forEach(group => {
      if (group !== target) group.classList.remove("open");
    });
  }

  function bindEvents() {
    const side = document.querySelector(".erp-universal-side");
    if (!side) return;

    side.addEventListener("click", event => {
      const button = event.target.closest(".erp-side-group > button");
      if (!button) return;

      event.preventDefault();
      event.stopPropagation();

      const target = document.getElementById(button.dataset.groupId);
      if (!target) return;

      if (side.classList.contains("collapsed")) setCollapsed(false);
      const opening = !target.classList.contains("open");
      closeOtherGroups(target);
      target.classList.toggle("open", opening);
    });

    side.addEventListener("mouseenter", () => {
      clearHideTimer();
      if (currentSettings.sidebarExpandOnHover === false || shellState === "expanded") return;
      shellState = "expanding";
      expandTimer = setTimeout(() => setCollapsed(false), Math.max(0, Number(currentSettings.sidebarExpandDelay || 0)));
    });

    side.addEventListener("mouseleave", () => {
      clearHideTimer();
      side.querySelectorAll(".erp-side-group.open").forEach(group => {
        if (!group.querySelector("a.active")) group.classList.remove("open");
      });
      if (currentSettings.sidebarCollapseOnLeave === false) return scheduleHide();
      shellState = "collapsing";
      hideTimer = setTimeout(() => setCollapsed(true), Math.max(0, Number(currentSettings.sidebarCollapseDelay || 0)));
    });

    const initiallyCollapsed =
      currentSettings.sidebarAutoHide === true ||
      currentSettings.sidebarDefaultCollapsed === true;

    setCollapsed(initiallyCollapsed);
  }

  function applyVariables() {
    const root = document.documentElement;
    const bgType=String(currentSettings.sidebarBackgroundType||"solid");
    const bg1=currentSettings.sidebarBackground||"#0f172a";
    const bg2=currentSettings.sidebarBackground2||bg1;
    const background=bgType==="gradient"?`linear-gradient(180deg,${bg1},${bg2})`:bg1;
    root.style.setProperty("--erp-side-width", `${Number(currentSettings.sidebarWidth || 182)}px`);
    root.style.setProperty("--erp-side-collapsed", `${Number(currentSettings.sidebarCollapsedWidth || 58)}px`);
    root.style.setProperty("--erp-side-animation", `${Number(currentSettings.sidebarAnimationMs || 180)}ms`);
    root.style.setProperty("--erp-side-font-family", currentSettings.sidebarFontFamily || "Segoe UI, Arial, sans-serif");
    root.style.setProperty("--erp-side-font-size", `${Number(currentSettings.sidebarFontSize || 12)}px`);
    root.style.setProperty("--erp-side-submenu-font-size", `${Number(currentSettings.sidebarSubmenuFontSize || 11)}px`);
    root.style.setProperty("--erp-side-font-weight", String(Number(currentSettings.sidebarFontWeight || 600)));
    root.style.setProperty("--erp-side-line-height", String(Number(currentSettings.sidebarLineHeight || 1.25)));
    root.style.setProperty("--erp-side-letter-spacing", `${Number(currentSettings.sidebarLetterSpacing || 0)}px`);
    root.style.setProperty("--erp-side-text-transform", currentSettings.sidebarTextTransform || "none");
    root.style.setProperty("--erp-side-icon-size", `${Number(currentSettings.sidebarIconSize || 15)}px`);
    root.style.setProperty("--erp-side-icon-gap", `${Number(currentSettings.sidebarIconGap || 8)}px`);
    root.style.setProperty("--sidebar-bg", background);
    root.style.setProperty("--sidebar-text", currentSettings.sidebarText || "#ffffff");
    root.style.setProperty("--sidebar-icon", currentSettings.sidebarIconColor || currentSettings.sidebarText || "#ffffff");
    root.style.setProperty("--sidebar-hover-bg", currentSettings.hoverBackground || "rgba(255,255,255,.1)");
    root.style.setProperty("--sidebar-hover-text", currentSettings.hoverText || "#ffffff");
    root.style.setProperty("--erp-shell-active", currentSettings.activeBackground || currentSettings.activeColor || "#f59e0b");
    root.style.setProperty("--erp-shell-active-text", currentSettings.activeText || "#111827");
    root.style.setProperty("--erp-submenu-active", currentSettings.submenuActiveColor || "#f59e0b");
    root.style.setProperty("--erp-side-border", currentSettings.borderColor || "#334155");
    root.style.setProperty("--erp-tooltip-bg", currentSettings.tooltipBackground || "#0b1220");
    root.style.setProperty("--erp-tooltip-text", currentSettings.tooltipText || "#ffffff");
    root.style.setProperty("--erp-side-opacity", String(Number(currentSettings.sidebarOpacity ?? 1)));
    root.style.setProperty("--erp-side-blur", `${Number(currentSettings.sidebarBlur || 0)}px`);
    document.body.classList.toggle("erp-sidebar-tooltips-off",currentSettings.sidebarShowTooltips===false);
    document.body.classList.toggle("erp-sidebar-glass",bgType==="glass");
  }

  function render(settings = {}) {
    currentSettings = { ...DEFAULTS, ...settings };
    clearHideTimer();
    applyVariables();

    document.body.classList.remove("erp-shell-top", "erp-shell-hybrid");
    document.body.classList.add("erp-shell-left");

    const host = ensureHosts();
    host.innerHTML = `<aside class="erp-universal-side">
      ${brand()}
      <nav>${renderMenu()}</nav>
      ${profile()}
    </aside>`;

    bindEvents();
  }

  function init() {
    render(getSettings());
  }

  window.ERPUniversalShell = {
    init,
    render,
    getSettings,
    refreshMenu() {
      render(getSettings());
    },
    collapse() { setCollapsed(true); },
    expand() { setCollapsed(false); }
  };

  window.addEventListener("erp-shell-settings-changed", event => {
    render(event.detail || getSettings());
  });

  window.addEventListener("storage", event => {
    if (event.key === SETTINGS_KEY || event.key === REGISTRY_KEY) {
      render(getSettings());
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
