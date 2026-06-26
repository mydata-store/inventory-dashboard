const SUPABASE_URL = "https://lzsxtvkluqvcaetnnydu.supabase.co";
const SUPABASE_KEY = "sb_publishable_QfemUy-S0bO7fy6-uL_jBA_ZzGXKgma";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let dashboardItems = [];

/* Sidebar */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

/* Pakistan Time */
function updateClock() {
  const now = new Date();

  const pktTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Karachi" })
  );

  let hours = pktTime.getHours();
  const minutes = String(pktTime.getMinutes()).padStart(2, "0");
  const seconds = String(pktTime.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const clock = document.getElementById("clock");
  if (clock) {
    clock.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
  }
}

/* Counter Animation */
function animateNumber(elementId, target) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let start = 0;
  const duration = 700;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;

  const timer = setInterval(() => {
    start += increment;

    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, stepTime);
}

/* Load Dashboard Data */
async function loadDashboard() {
  const { data, error } = await db
    .from("items")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Dashboard load error:", error.message);
    return;
  }

  dashboardItems = data || [];

  const totalItems = dashboardItems.length;

  const lowItems = dashboardItems.filter(item => {
    const opening = Number(item.opening_stock || 0);
    const minimum = Number(item.minimum_stock || 0);
    return opening <= minimum;
  });

  animateNumber("totalItems", totalItems);
  animateNumber("lowStock", lowItems.length);

  renderLowStock(lowItems);
}

/* Low Stock List */
function renderLowStock(items) {
  const list = document.getElementById("lowStockList");
  if (!list) return;

  if (!items.length) {
    list.innerHTML = `
      <div class="low-item">
        <div class="low-top">
          <span>All items are above minimum stock</span>
          <b>OK</b>
        </div>
        <div class="progress"><span style="width:100%; background:#22c55e;"></span></div>
      </div>
    `;
    return;
  }

  list.innerHTML = "";

  items.slice(0, 5).forEach(item => {
    const stock = Number(item.opening_stock || 0);
    const minimum = Number(item.minimum_stock || 0);

    let percent = 10;
    if (minimum > 0) {
      percent = Math.min(100, Math.max(5, (stock / minimum) * 100));
    }

    list.innerHTML += `
      <div class="low-item">
        <div class="low-top">
          <span>${item.item_name || "Unnamed Item"} ${item.size || ""}</span>
          <b>${stock} ${item.unit || ""}</b>
        </div>
        <small>Item Code: ${item.item_code || ""} | Min: ${minimum} ${item.unit || ""}</small>
        <div class="progress">
          <span style="width:${percent}%"></span>
        </div>
      </div>
    `;
  });
}

/* Auto Close Sidebar on Desktop Reset */
function handleResize() {
  if (window.innerWidth > 768) {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("show");
  }
}

/* Initial Load */
document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  loadDashboard();

  setInterval(updateClock, 1000);
  setInterval(loadDashboard, 30000);

  window.addEventListener("resize", handleResize);
});
