const COLORS = {
  OFF: "#555",        // cinza 555
  ON: "#2ecc71",
  PENDING: "#f39c12",
  ERROR: "#000"
};

const relayState = {};

async function loadDevices() {
  const devices = await loadJSON("devices.json");
  const config = await loadJSON("config.json");

  const container = document.getElementById("devices");
  container.innerHTML = "";

  for (const mac in devices) {
    const name = devices[mac];
    const relays = config[mac]?.relays || 0;

    const card = document.createElement("div");
    card.className = "device-card";

    card.innerHTML = `
      <h3>${name}</h3>
      <p class="mac">${mac}</p>
      <div class="relays">
        ${renderRelays(mac, relays)}
      </div>
    `;

    container.appendChild(card);
  }

  initRelays(); 
}

function renderRelays(mac, count) {
  let html = "";
  for (let i = 1; i <= count; i++) {
    html += `
      <button class="relay"
        data-mac="${mac}"
        data-relay="${i}">
        Relé ${i}
      </button>
    `;
  }
  return html;
}

function initRelays() {
  document.querySelectorAll(".relay").forEach(btn => {
    const mac = btn.dataset.mac;
    const relay = btn.dataset.relay;

    if (!relayState[mac]) relayState[mac] = {};

    relayState[mac][relay] = {
      state: "OFF",
      timeout: null
    };

    setRelayVisual(btn, "OFF");

    btn.addEventListener("click", () =>
      onRelayClick(mac, relay, btn)
    );
  });
}

function setRelayVisual(button, state) {
  button.style.background = COLORS[state];
  button.dataset.state = state;
}

function onRelayClick(mac, relay, button) {
  const info = relayState[mac][relay];

  if (info.state === "PENDING") return;

  const next = info.state === "ON" ? "OFF" : "ON";

  setRelayVisual(button, "PENDING");
  info.state = "PENDING";

  console.log(`CMD:RL:${relay}:${next} → ${mac}`);

  info.timeout = setTimeout(() => {
    setRelayVisual(button, "ERROR");
    info.state = "ERROR";
    console.error(`Timeout relé ${relay} (${mac})`);
  }, 2000);
}

function onRelayStatus(mac, relay, state) {
  relay = String(relay);

  const info = relayState[mac]?.[relay];
  if (!info) return;

  clearTimeout(info.timeout);
  info.state = state;

  const btn = document.querySelector(
    `.relay[data-mac="${mac}"][data-relay="${relay}"]`
  );

  if (btn) setRelayVisual(btn, state);
}

