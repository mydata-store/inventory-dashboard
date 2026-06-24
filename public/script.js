function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  const clock = document.getElementById("clock");
  if (clock) clock.textContent = time;
}

function updateDates() {
  const now = new Date();

  const desiDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const hijriDate = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(now);

  document.getElementById("desiDate").textContent = desiDate;
  document.getElementById("hijriDate").textContent = hijriDate;
}

updateClock();
updateDates();
setInterval(updateClock, 1000);

console.log("Inventory dashboard ready");
