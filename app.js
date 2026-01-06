async function loadJSON(file) {
  const res = await fetch(file);
  return await res.json();
}

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
        ${renderRelays(relays)}
      </div>
    `;

    container.appendChild(card);
  }
}

function renderRelays(count) {
  let html = "";
  for (let i = 1; i <= count; i++) {
    html += `
      <button class="relay off" data-relay="${i}">
        Relé ${i}
      </button>
    `;
  }
  return html;
}
