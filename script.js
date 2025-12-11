// --- Locale strings ---
const STRINGS = {
  en: {
    statusLoading: "Loading cards…",
    statusLoaded: "Cards loaded",
    statusFallback: "Fallback cards active",
    eyebrow: "Party setup",
    heroTitle: "Start a lobby\nshare the seed\nplay together IRL.",
    heroSub: "Black cards sync via seed, white cards are random per device. Local only, no servers.",
    seedPlaceholder: "Enter or create lobby seed",
    create: "Create lobby",
    join: "Join lobby",
    finePrint: "Tip: use the same seed on all devices.",
    previewBlack: "“Question cards” sync by seed.",
    previewWhite: "Answer cards are random per device.",
    goToTable: "Go to table",
    copySeed: "Copy seed",
    lobbySeed: "Lobby seed",
    startRound: "Start round",
    exitGame: "Exit game",
    blackLabel: "BLACK CARD (Question)",
    blackTap: "Tap “Start round”.",
    blackHint: "Tap/click for next round",
    handLabel: "YOUR WHITE CARDS (Answers)",
    playLabel: "Selected card",
    placeholder: "Click a white card",
    flowHeading: "Flow",
    step1: "Share the seed. Everyone enters the same seed.",
    step2: "Start round. New black card + hand are dealt.",
    step3: "Pick a white card. One click; no redraws.",
    step4: "Next round. Click the black card.",
    note: "All local in your browser. No server, no tracking.",
    footer: "Unofficial, inspired by Cards Against Humanity.",
    toastReady: "Lobby ready – start round!",
    toastCreated: "Seed created",
    toastSet: "Seed set",
    toastCopied: "Seed copied",
    toastRound: n => `Round ${n}`,
    toastExit: "Exited game",
    toastShow: "Showing to players",
    alertNeedSeed: "Please enter a seed.",
    alertNeedSeedFirst: "Please create or enter a seed.",
    alertCardsNotReady: "Cards not loaded yet.",
    alertSelect: "Pick a white card first."
  },
  de: {
    statusLoading: "Lade Karten…",
    statusLoaded: "Karten geladen",
    statusFallback: "Fallback-Karten aktiv",
    eyebrow: "Party-Setup",
    heroTitle: "Starte eine Lobby\nteile den Seed\nspielt zusammen IRL.",
    heroSub: "Schwarze Karten sind per Seed synchron, weiße Karten pro Gerät zufällig. Lokal, kein Server.",
    seedPlaceholder: "Lobby-Seed eingeben oder erstellen",
    create: "Lobby erstellen",
    join: "Lobby beitreten",
    finePrint: "Tipp: Nutze denselben Seed auf allen Geräten.",
    previewBlack: "„Fragekarten“ werden per Seed synchronisiert.",
    previewWhite: "Antwortkarten sind pro Gerät zufällig.",
    goToTable: "Zum Spieltisch",
    copySeed: "Seed kopieren",
    lobbySeed: "Lobby-Seed",
    startRound: "Runde starten",
    exitGame: "Spiel verlassen",
    blackLabel: "SCHWARZE KARTE (Frage)",
    blackTap: "Tippe „Runde starten“.",
    blackHint: "Tippen/Klicken für nächste Runde",
    handLabel: "DEINE WEISSEN KARTEN (Antworten)",
    playLabel: "Ausgewählte Karte",
    placeholder: "Klicke auf eine weiße Karte",
    flowHeading: "Flow",
    step1: "Seed teilen. Alle geben denselben Seed ein.",
    step2: "Runde starten. Neue schwarze Karte + Hand werden gegeben.",
    step3: "Weiße Karte wählen. Ein Klick; kein Nachziehen.",
    step4: "Nächste Runde. Schwarze Karte anklicken.",
    note: "Alles lokal im Browser. Kein Server, kein Tracking.",
    footer: "Inoffiziell, inspiriert von Cards Against Humanity.",
    toastReady: "Lobby bereit – Runde starten!",
    toastCreated: "Seed erstellt",
    toastSet: "Seed gesetzt",
    toastCopied: "Seed kopiert",
    toastRound: n => `Runde ${n}`,
    toastExit: "Spiel verlassen",
    toastShow: "Anzeige für Mitspielende",
    alertNeedSeed: "Bitte einen Seed eingeben.",
    alertNeedSeedFirst: "Bitte zuerst einen Seed erstellen oder eingeben.",
    alertCardsNotReady: "Karten sind noch nicht geladen.",
    alertSelect: "Bitte zuerst eine weiße Karte wählen."
  }
};

let lang = "en";
function t(key, ...args) {
  const val = STRINGS[lang][key];
  return typeof val === "function" ? val(...args) : val;
}

// --- PRNG helpers ---
function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0,
          (h2 ^ h1) >>> 0,
          (h3 ^ h1) >>> 0,
          (h4 ^ h1) >>> 0];
}
function mulberry32(a) {
  return function() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle(array, rand) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function getLocalRand() {
  try {
    const u32 = new Uint32Array(1);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(u32);
      return mulberry32(u32[0]);
    }
  } catch (e) {
    console.warn("crypto.getRandomValues not available, falling back to Math.random");
  }
  return mulberry32(Math.floor(Math.random() * 0xffffffff));
}

// --- DOM refs ---
const seedInput = document.getElementById("seedInput");
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const btnCopy = document.getElementById("btnCopy");
const btnCopyTop = document.getElementById("btnCopyTop");
const btnGoToTable = document.getElementById("btnGoToTable");
const btnStartRound = document.getElementById("btnStartRound");
const btnExit = document.getElementById("btnExit");
const btnLang = document.getElementById("btnLang");
const btnShowcase = document.getElementById("btnShowcase");
const btnCloseShow = document.getElementById("btnCloseShow");
const blackCardEl = document.getElementById("blackCard");
const blackTextEl = document.getElementById("blackText");
const whiteHandEl = document.getElementById("whiteHand");
const selectedCardSlot = document.getElementById("selectedCardSlot");
const seedDisplay = document.getElementById("seedDisplay");
const statusChip = document.getElementById("statusChip");
const toastEl = document.getElementById("toast");
const screenIntro = document.getElementById("screenIntro");
const screenTable = document.getElementById("screenTable");
const currentSeedLabel = document.getElementById("currentSeedLabel");
const showcase = document.getElementById("showcase");
const showBlack = document.getElementById("showBlack");
const showWhite = document.getElementById("showWhite");

// Text nodes
const txtEyebrow = document.getElementById("txtEyebrow");
const txtHeroTitle = document.getElementById("txtHeroTitle");
const txtHeroSub = document.getElementById("txtHeroSub");
const txtFinePrint = document.getElementById("txtFinePrint");
const txtPreviewBlack = document.getElementById("txtPreviewBlack");
const txtPreviewWhite = document.getElementById("txtPreviewWhite");
const txtLobbySeed = document.getElementById("txtLobbySeed");
const txtBlackLabel = document.getElementById("txtBlackLabel");
const txtBlackHint = document.getElementById("txtBlackHint");
const txtHandLabel = document.getElementById("txtHandLabel");
const txtPlayLabel = document.getElementById("txtPlayLabel");
const txtPlaceholder = document.getElementById("txtPlaceholder");
const txtFlowHeading = document.getElementById("txtFlowHeading");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const step4 = document.getElementById("step4");
const txtNote = document.getElementById("txtNote");
const txtFooter = document.getElementById("txtFooter");

// --- State ---
let blackCards = [];
let whiteCards = [];
let fallbackLoaded = false;
let currentSeed = "";
let currentBlackIndex = 0;
let selectedWhite = "";
let cardsReady = false;
let tableEntered = false;
let gameStarted = false;

// --- Fallback card data (German) ---
const FALLBACK = { blackCards: [], whiteCards: [] };
FALLBACK.blackCards = [
  "six seven tuff"
];
FALLBACK.whiteCards = [
  "six seven tuff"
];

// --- Load cards from JSON ---
async function loadCards() {
  try {
    const res = await fetch("cards.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();
    blackCards = Array.isArray(data.blackCards) && data.blackCards.length ? data.blackCards : FALLBACK.blackCards;
    whiteCards = Array.isArray(data.whiteCards) && data.whiteCards.length ? data.whiteCards : FALLBACK.whiteCards;
    cardsReady = true;
    statusChip.textContent = t("statusLoaded");
  } catch (e) {
    console.warn("cards.json could not be loaded, using fallback.", e);
    blackCards = FALLBACK.blackCards;
    whiteCards = FALLBACK.whiteCards;
    cardsReady = true;
    fallbackLoaded = true;
    statusChip.textContent = t("statusFallback");
  }
}

// --- Seed helpers ---
function genSeed() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
function getRandFromSeed(seed, offset = 0) {
  const h = cyrb128(seed + ":" + offset);
  return mulberry32(h[0]);
}

// --- UI helpers ---
function applyLocaleTexts() {
  statusChip.textContent = cardsReady
    ? (fallbackLoaded ? t("statusFallback") : t("statusLoaded"))
    : t("statusLoading");
  txtEyebrow.textContent = t("eyebrow");
  txtHeroTitle.innerHTML = t("heroTitle").replace(/\n/g, "<br/>");
  txtHeroSub.textContent = t("heroSub");
  seedInput.placeholder = t("seedPlaceholder");
  btnCreate.textContent = t("create");
  btnJoin.textContent = t("join");
  txtFinePrint.textContent = t("finePrint");
  txtPreviewBlack.textContent = t("previewBlack");
  txtPreviewWhite.textContent = t("previewWhite");
  btnGoToTable.textContent = t("goToTable");
  btnCopy.textContent = t("copySeed");
  btnCopyTop.textContent = t("copySeed");
  btnStartRound.textContent = t("startRound");
  btnExit.textContent = t("exitGame");
  btnShowcase.textContent = lang === "en" ? "Show to players" : "Allen zeigen";
  btnCloseShow.textContent = lang === "en" ? "Close" : "Schließen";
  txtLobbySeed.textContent = t("lobbySeed");
  txtBlackLabel.textContent = t("blackLabel");
  blackTextEl.textContent = currentSeed ? blackTextEl.textContent : t("blackTap");
  txtBlackHint.textContent = t("blackHint");
  txtHandLabel.textContent = t("handLabel");
  txtPlayLabel.textContent = t("playLabel");
  txtPlaceholder.textContent = t("placeholder");
  txtFlowHeading.textContent = t("flowHeading");
  step1.innerHTML = `<strong>${t("step1").split(". ")[0]}.</strong> ${t("step1").split(". ").slice(1).join(". ")}`;
  step2.innerHTML = `<strong>${t("step2").split(". ")[0]}.</strong> ${t("step2").split(". ").slice(1).join(". ")}`;
  step3.innerHTML = `<strong>${t("step3").split(". ")[0]}.</strong> ${t("step3").split(". ").slice(1).join(". ")}`;
  step4.innerHTML = `<strong>${t("step4").split(". ")[0]}.</strong> ${t("step4").split(". ").slice(1).join(". ")}`;
  txtNote.textContent = t("note");
  txtFooter.textContent = t("footer");
  btnLang.textContent = lang === "en" ? "Deutsch" : "English";
  document.documentElement.lang = lang;
  currentSeedLabel.textContent = currentSeed ? `Seed: ${currentSeed}` : (lang === "en" ? "Seed: —" : "Seed: —");
}

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 1500);
}

function updateSelectedSlot() {
  selectedCardSlot.innerHTML = "";
  if (!selectedWhite) {
    const ph = document.createElement("div");
    ph.className = "placeholder";
    ph.textContent = t("placeholder");
    selectedCardSlot.appendChild(ph);
    return;
  }
  const card = document.createElement("div");
  card.className = "selected-visual";
  card.textContent = selectedWhite;
  selectedCardSlot.appendChild(card);
}

function clearSelection() {
  selectedWhite = "";
  updateSelectedSlot();
  whiteHandEl.querySelectorAll(".white-card.selected").forEach(n => n.classList.remove("selected"));
}

// Showcase helpers
function openShowcase() {
  if (!selectedWhite) {
    alert(t("alertSelect"));
    return;
  }
  showBlack.textContent = blackTextEl.textContent || "";
  showWhite.textContent = selectedWhite;
  showcase.classList.remove("hidden");
  showcase.classList.add("visible");
  showToast(t("toastShow"));
}
function closeShowcase() {
  showcase.classList.add("hidden");
  showcase.classList.remove("visible");
}

// --- Render ---
function renderBlackCard() {
  if (!currentSeed) {
    blackTextEl.textContent = t("blackTap");
    return;
  }
  const rand = getRandFromSeed(currentSeed);
  const order = seededShuffle(blackCards, rand);
  const card = order[currentBlackIndex % order.length];
  blackTextEl.textContent = card;
}

function renderWhiteHand() {
  if (!whiteHandEl) return;
  whiteHandEl.innerHTML = "";
  clearSelection();
  const localRand = getLocalRand();
  const picks = seededShuffle(whiteCards, localRand).slice(0, 8);
  picks.forEach(text => {
    const div = document.createElement("div");
    div.className = "white-card";
    div.textContent = text;
    div.onclick = () => selectWhiteCard(div, text);
    whiteHandEl.appendChild(div);
  });
}

// --- Selection logic ---
function selectWhiteCard(el, text) {
  whiteHandEl.querySelectorAll(".white-card.selected").forEach(n => n.classList.remove("selected"));
  el.classList.add("selected");
  selectedWhite = text;
  updateSelectedSlot();
}

// --- Flow control ---
function enterTable() {
  if (!currentSeed) {
    alert(t("alertNeedSeedFirst"));
    return;
  }
  tableEntered = true;
  screenIntro.classList.add("hidden");
  screenIntro.style.display = "none";        // force hide intro
  screenTable.classList.remove("hidden");
  screenTable.style.display = "";            // ensure visible
  seedDisplay.textContent = currentSeed;
  currentSeedLabel.textContent = `Seed: ${currentSeed}`;
  if (!gameStarted) showToast(t("toastReady"));
}

function hideStartButton() {
  btnStartRound.style.display = "none";
}
function showStartButton() {
  btnStartRound.style.display = "";
}

function startRound() {
  if (!cardsReady) {
    alert(t("alertCardsNotReady"));
    return;
  }
  if (!currentSeed) {
    alert(t("alertNeedSeed"));
    return;
  }
  enterTable();          // close setup if still open
  gameStarted = true;
  hideStartButton();     // prevent re-deals
  renderBlackCard();
  renderWhiteHand();     // dealt once per round
  showToast(t("toastRound", currentBlackIndex + 1));
}

function nextRound() {
  currentBlackIndex += 1;
  renderBlackCard();
  renderWhiteHand();
  showToast(t("toastRound", currentBlackIndex + 1));
}

function exitGame() {
  tableEntered = false;
  gameStarted = false;
  currentBlackIndex = 0;
  selectedWhite = "";
  screenTable.classList.add("hidden");
  screenTable.style.display = "none";
  screenIntro.classList.remove("hidden");
  screenIntro.style.display = "";            // show intro again
  seedDisplay.textContent = "—";
  currentSeedLabel.textContent = lang === "en" ? "Seed: —" : "Seed: —";
  blackTextEl.textContent = t("blackTap");
  whiteHandEl.innerHTML = "";
  updateSelectedSlot();
  currentSeed = "";
  seedInput.value = "";
  btnGoToTable.disabled = true;
  btnStartRound.disabled = true;
  showStartButton();     // restore start button for next session
  closeShowcase();
  showToast(t("toastExit"));
}

// --- Events ---
btnCreate.onclick = () => {
  currentSeed = genSeed();
  seedInput.value = currentSeed;
  currentBlackIndex = 0;
  btnGoToTable.disabled = false;
  btnStartRound.disabled = false;
  showStartButton();
  seedDisplay.textContent = currentSeed;
  currentSeedLabel.textContent = `Seed: ${currentSeed}`;
  showToast(t("toastCreated"));
};

btnJoin.onclick = () => {
  const seed = seedInput.value.trim().toUpperCase();
  if (!seed) {
    alert(t("alertNeedSeed"));
    return;
  }
  currentSeed = seed;
  currentBlackIndex = 0;
  btnGoToTable.disabled = false;
  btnStartRound.disabled = false;
  showStartButton();
  seedDisplay.textContent = currentSeed;
  currentSeedLabel.textContent = `Seed: ${currentSeed}`;
  showToast(t("toastSet"));
};

btnCopy.onclick = async () => {
  if (!seedInput.value) return alert(t("alertNeedSeed"));
  try {
    await navigator.clipboard.writeText(seedInput.value.trim());
    showToast(t("toastCopied"));
  } catch (e) {
    alert("Copy failed; please copy manually.");
  }
};

btnCopyTop.onclick = () => btnCopy.onclick();

btnGoToTable.onclick = () => enterTable();

btnStartRound.onclick = () => startRound();

blackCardEl.onclick = () => {
  if (!currentSeed) return;
  if (!gameStarted) {
    startRound();
  } else {
    nextRound();
  }
};

btnExit.onclick = () => exitGame();

btnLang.onclick = () => {
  lang = lang === "en" ? "de" : "en";
  applyLocaleTexts();
};

btnShowcase.onclick = () => openShowcase();
btnCloseShow.onclick = () => closeShowcase();

// --- Init ---
statusChip.textContent = t("statusLoading");
applyLocaleTexts();
loadCards().then(() => {
  btnGoToTable.disabled = !currentSeed;
  btnStartRound.disabled = !currentSeed;
  applyLocaleTexts();
});
renderBlackCard();
updateSelectedSlot();
