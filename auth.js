async function loadAuth() {
  const res = await fetch("auth.json");
  return await res.json();
}

async function checkPin() {
  const input = document.getElementById("pin").value;
  const auth = await loadAuth();

  if (input === auth.pin) {
    localStorage.setItem("auth", "ok");
    showApp();
  } else {
    alert("PIN incorreto");
  }
}

function showApp() {
  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function checkSession() {
  if (localStorage.getItem("auth") === "ok") {
    showApp();
  }
}

window.onload = checkSession;
