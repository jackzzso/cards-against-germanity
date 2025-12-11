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
    create: "Create Lobby",
    join: "Join Lobby",
    finePrint: "Tip: use the same seed on all devices.",
    previewBlack: "“Question cards” sync by seed.",
    previewWhite: "Answer cards are random per device.",
    goToTable: "Go To Table",
    copySeed: "Copy Seed",
    lobbySeed: "Lobby seed",
    startRound: "Start Round",
    exitGame: "Exit Game",
    blackLabel: "BLACK CARD (Question)",
    blackTap: "Tap “Start round”.",
    blackHint: "Tap/click for next round",
    handLabel: "YOUR WHITE CARDS (Answers)",
    playLabel: "Selected Card",
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
    alertSelect: "Pick a white card first.",
    roundLabel: "Round",
    endEyebrow: "Nice run!",
    endTitle: "You played all black cards.",
    endSub: "Time for a new seed or replay this one from the start.",
    endReplay: "Replay seed",
    endExit: "Back to lobby"
  },
  de: {
    statusLoading: "Lade Karten…",
    statusLoaded: "Karten geladen",
    statusFallback: "Fallback-Karten aktiv",
    eyebrow: "PARTY SETUP",
    heroTitle: "Starte eine Lobby\nteile den Seed\nspielt zusammen IRL.",
    heroSub: "Schwarze Karten sind per Seed synchron, weiße Karten pro Gerät zufällig. Lokal, kein Server.",
    seedPlaceholder: "Lobby Seed eingeben oder erstellen",
    create: "Lobby erstellen",
    join: "Lobby beitreten",
    finePrint: "Tipp: Nutze denselben Seed auf allen Geräten.",
    previewBlack: "“Fragekarten“ werden per Seed synchronisiert.",
    previewWhite: "Antwortkarten sind pro Gerät zufällig.",
    goToTable: "Zum Spieltisch",
    copySeed: "Seed kopieren",
    lobbySeed: "Lobby-Seed",
    startRound: "Runde starten",
    exitGame: "Spiel verlassen",
    blackLabel: "SCHWARZE KARTE (Frage)",
    blackTap: "Tippe “Runde starten“.",
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
    alertSelect: "Bitte zuerst eine weiße Karte wählen.",
    roundLabel: "Runde",
    endEyebrow: "Starke Runde!",
    endTitle: "Alle schwarzen Karten gespielt.",
    endSub: "Zeit für einen neuen Seed oder von vorn starten.",
    endReplay: "Seed erneut spielen",
    endExit: "Zurück zur Lobby"
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
const btnNextRound = document.getElementById("btnNextRound");
const btnCancelShow = document.getElementById("btnCancelShow");
const btnViewSource = document.getElementById("btnViewSource");
const blackCardEl = document.getElementById("blackCard");
const blackTextEl = document.getElementById("blackText");
const whiteHandEl = document.getElementById("whiteHand");
const selectedCardSlot = document.getElementById("selectedCardSlot");
const seedDisplay = document.getElementById("seedDisplay");
const roundDisplay = document.getElementById("roundDisplay");
const toastEl = document.getElementById("toast");
const screenIntro = document.getElementById("screenIntro");
const screenTable = document.getElementById("screenTable");
const currentSeedLabel = document.getElementById("currentSeedLabel");
const showcase = document.getElementById("showcase");
const showBlack = document.getElementById("showBlack");
const showWhite = document.getElementById("showWhite");
const showBlackText = document.getElementById("showBlackText");
const showWhiteText = document.getElementById("showWhiteText");
const endOverlay = document.getElementById("endOverlay");
const btnEndReplay = document.getElementById("btnEndReplay");
const btnEndExit = document.getElementById("btnEndExit");
const txtEndEyebrow = document.getElementById("txtEndEyebrow");
const txtEndTitle = document.getElementById("txtEndTitle");
const txtEndSub = document.getElementById("txtEndSub");

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
const txtRoundLabel = document.getElementById("txtRoundLabel");
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
let blackOrder = [];
let gameEnded = false;
let autoAdvancePending = false;

// --- Fallback card data (German) ---
const FALLBACK = { blackCards: [], whiteCards: [] };
FALLBACK.blackCards = [
  "q7f-gn2v",
  "zipped-aur4",
  "mango-9rtx",
  "vex-4m3t",
  "lunar-y82k",
  "blunt-k59q",
  "fract-1p0z",
  "orbit-s3ld",
  "gamma-7hcn",
  "pixel-r04v"
];
FALLBACK.whiteCards = [
  "wq1-3mx",
  "aur-94pl",
  "delta-z1k9",
  "sun-8vpm",
  "rose-2b7x",
  "tile-5r0q",
  "grid-6n3f",
  "vane-1t8y",
  "rift-0k4s",
  "mint-7c2p",
  "opal-9g1d",
  "node-3h6v",
  "flax-2q8m",
  "bolt-5w0z",
  "cove-4n1r",
  "hush-6k7t",
  "purl-0s3x",
  "tide-8m2y",
  "gleam-1v9p",
  "cairn-7d4q",
  "brio-5k0n",
  "sift-3r8b",
  "prism-2y6z",
  "muse-9t1f",
  "jolt-4p7v",
  "saber-0n5k",
  "flit-6q2r",
  "moss-1c8x",
  "crest-7g3m",
  "dune-5b0y",
  "lore-3t9p",
  "glow-2k6z",
  "spry-8v1d",
  "plink-4n7q",
  "whorl-0r3m",
  "snug-6p2y",
  "bramble-1x9f",
  "rudder-5t4v",
  "cinder-3k0n",
  "pocket-2m8b",
  "havoc-9s1q",
  "fable-7d4r",
  "quiver-0y6p",
  "squib-5n2z",
  "tinker-1v7k",
  "bloom-3r0m",
  "grove-6p8x",
  "shiver-4t1q",
  "plinket-2b9v",
  "marsh-8k3d",
  "sprout-0n5y",
  "cobalt-7m2f",
  "ripple-1q6p",
  "stitch-3v9z",
  "ember-5c0k",
  "thimble-2r7m",
  "flick-4n1y",
  "paddle-6s8q",
  "meadow-0t3v",
  "caper-9p2d",
  "glisten-1k7b",
  "snare-3m5q",
  "parcel-8v0n",
  "tangent-4r1p",
  "mimic-2y6z",
  "sienna-7k3f",
  "plait-0n9v",
  "caper-5t2r",
  "dapple-1m8q",
  "wicker-3p7y",
  "keystone-6v0d",
  "sprocket-4n1b",
  "cantor-2r9p",
  "natter-8k3v",
  "gambit-0t5q",
  "pollen-1m6z",
  "riff-3y8d",
  "mottle-5p2k",
  "canto-7r0v",
  "plinth-4n1q",
  "briar-2k9m",
  "hollow-6t3y",
  "glean-0p7f",
  "sway-1r8v",
  "quark-3n5q",
  "fray-9k2p",
  "midden-4t0z",
  "wring-2v6d",
  "soot-1p7m",
  "ledger-3r9y",
  "trundle-5k0q",
  "pique-0n4v",
  "grovel-6t2b",
  "singe-1m8p",
  "cudgel-3y5q",
  "rivet-9k0n",
  "furl-4r7v",
  "harbor-2p1d",
  "latch-6n3q",
  "pilfer-0t8m",
  "squid-1v5y",
  "buckle-3k9p",
  "tarnish-4r0z",
  "murmur-2n6v",
  "shamble-1p7q",
  "dawdle-5m3k",
  "skiff-0y2d",
  "haven-3r8p",
  "tweak-6n1v",
  "crinkle-4k9q",
  "baffle-2p0m",
  "swill-1t6y",
  "graft-3v7d",
  "pursue-5n2q",
  "rambler-0k4v",
  "cuddle-1m9p",
  "sputter-3r5z",
  "nudge-6t2q",
  "glimmer-4p0n",
  "rustle-2k7v",
  "thrive-1m3d",
  "mingle-0r8y",
  "bellow-5p1q",
  "whim-3k6v",
  "saturate-2n0z",
  "frost-1t9p"
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
    showToast(t("statusLoaded"));
  } catch (e) {
    console.warn("cards.json could not be loaded, using fallback.", e);
    blackCards = FALLBACK.blackCards;
    whiteCards = FALLBACK.whiteCards;
    cardsReady = true;
    fallbackLoaded = true;
    showToast(t("statusFallback"));
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
  btnShowcase.textContent = lang === "en" ? "Show To Players" : "Allen zeigen";
  txtLobbySeed.textContent = t("lobbySeed");
  txtBlackLabel.textContent = t("blackLabel");
  blackTextEl.textContent = currentSeed ? blackTextEl.textContent : t("blackTap");
  txtBlackHint.textContent = t("blackHint");
  txtHandLabel.textContent = t("handLabel");
  txtPlayLabel.textContent = t("playLabel");
  txtPlaceholder.textContent = t("placeholder");
  txtFlowHeading.textContent = t("flowHeading");
  txtRoundLabel.textContent = t("roundLabel");
  step1.innerHTML = `<strong>${t("step1").split(". ")[0]}.</strong> ${t("step1").split(". ").slice(1).join(". ")}`;
  step2.innerHTML = `<strong>${t("step2").split(". ")[0]}.</strong> ${t("step2").split(". ").slice(1).join(". ")}`;
  step3.innerHTML = `<strong>${t("step3").split(". ")[0]}.</strong> ${t("step3").split(". ").slice(1).join(". ")}`;
  step4.innerHTML = `<strong>${t("step4").split(". ")[0]}.</strong> ${t("step4").split(". ").slice(1).join(". ")}`;
  txtNote.textContent = t("note");
  txtFooter.textContent = t("footer");
  btnLang.textContent = lang === "en" ? "Deutsch" : "English";
  document.documentElement.lang = lang;
  currentSeedLabel.textContent = currentSeed ? `Seed: ${currentSeed}` : (lang === "en" ? "Seed: —" : "Seed: —");
  txtEndEyebrow.textContent = t("endEyebrow");
  txtEndTitle.textContent = t("endTitle");
  txtEndSub.textContent = t("endSub");
  btnEndReplay.textContent = t("endReplay");
  btnEndExit.textContent = t("endExit");
}

function showToast(msg, type = "info") {
  toastEl.textContent = msg;
  toastEl.classList.remove("warn");
  if (type === "warn") toastEl.classList.add("warn");
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 1800);
}

function updateSelectedSlot() {
  selectedCardSlot.innerHTML = "";
  if (!selectedWhite) {
    const ph = document.createElement("div");
    ph.className = "placeholder";
    ph.textContent = t("placeholder");
    selectedCardSlot.appendChild(ph);
    selectedCardSlot.onclick = null;
    return;
  }
  const card = document.createElement("div");
  card.className = "selected-visual";
  card.textContent = selectedWhite;
  selectedCardSlot.appendChild(card);
  selectedCardSlot.onclick = () => clearSelection();
}

function clearSelection() {
  selectedWhite = "";
  updateSelectedSlot();
  whiteHandEl.querySelectorAll(".white-card.selected").forEach(n => n.classList.remove("selected"));
}

function updateRoundDisplay() {
  const hasDeck = blackOrder.length > 0;
  const inPlay = gameStarted || currentBlackIndex > 0;
  const val = hasDeck && inPlay ? currentBlackIndex + 1 : "—";
  roundDisplay.textContent = val;
}

// Showcase helpers
function openShowcase(autoAdvance = false) {
  if (!selectedWhite) {
    showToast(t("alertSelect"), "warn");
    autoAdvancePending = false;
    return;
  }
  if (showBlackText) showBlackText.textContent = blackTextEl.textContent || "";
  if (showWhiteText) showWhiteText.textContent = selectedWhite || "";
  autoAdvancePending = autoAdvance;
  showcase.classList.remove("hidden");
  showcase.classList.add("visible");
  showToast(t("toastShow"));
}
function closeShowcase({ advance = false } = {}) {
  showcase.classList.add("hidden");
  showcase.classList.remove("visible");
  if (advance && autoAdvancePending) {
    autoAdvancePending = false;
    nextRound();
  } else {
    autoAdvancePending = false;
  }
}

// --- Render ---
function renderBlackCard() {
  if (!currentSeed) {
    blackTextEl.textContent = t("blackTap");
    return;
  }
  if (!blackOrder.length) buildBlackOrder();
  if (!blackOrder.length) {
    blackTextEl.textContent = t("blackTap");
    return;
  }
  if (currentBlackIndex >= blackOrder.length) {
    endGame();
    return;
  }
  blackTextEl.textContent = blackOrder[currentBlackIndex];
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
    const brand = document.createElement("div");
    brand.className = "card-brand";
    const icon = document.createElement("span");
    icon.className = "brand-icon";
    const name = document.createElement("span");
    name.className = "brand-name";
    name.textContent = "Cards Against Germanity";
    brand.appendChild(icon);
    brand.appendChild(name);
    div.appendChild(brand);
    whiteHandEl.appendChild(div);
  });
}

// --- Selection logic ---
function selectWhiteCard(el, text) {
  const alreadySelected = el.classList.contains("selected") && selectedWhite === text;
  whiteHandEl.querySelectorAll(".white-card.selected").forEach(n => n.classList.remove("selected"));
  if (alreadySelected) {
    clearSelection();
    return;
  }
  el.classList.add("selected");
  selectedWhite = text;
  updateSelectedSlot();
}

// --- Flow control ---
function enterTable() {
  if (!currentSeed) {
    showToast(t("alertNeedSeedFirst"), "warn");
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
    showToast(t("alertCardsNotReady"), "warn");
    return;
  }
  if (!currentSeed) {
    showToast(t("alertNeedSeed"), "warn");
    return;
  }
  gameEnded = false;
  hideEndOverlay();
  if (!blackOrder.length) buildBlackOrder();
  if (!blackOrder.length) {
    showToast(t("alertCardsNotReady"), "warn");
    return;
  }
  enterTable();          // close setup if still open
  gameStarted = true;
  hideStartButton();     // prevent re-deals
  renderBlackCard();
  renderWhiteHand();     // dealt once per round
  showToast(t("toastRound", currentBlackIndex + 1));
  btnShowcase.disabled = false;
  updateRoundDisplay();
}

function nextRound() {
  if (gameEnded) {
    showEndOverlay();
    return;
  }
  currentBlackIndex += 1;
  if (currentBlackIndex >= blackOrder.length) {
    endGame();
    return;
  }
  renderBlackCard();
  renderWhiteHand();
  showToast(t("toastRound", currentBlackIndex + 1));
  updateRoundDisplay();
}

function exitGame() {
  tableEntered = false;
  gameStarted = false;
  currentBlackIndex = 0;
  selectedWhite = "";
  blackOrder = [];
  gameEnded = false;
  btnShowcase.disabled = true;
  screenTable.classList.add("hidden");
  screenTable.style.display = "none";
  screenIntro.classList.remove("hidden");
  screenIntro.style.display = "";            // show intro again
  seedDisplay.textContent = "—";
  currentSeedLabel.textContent = lang === "en" ? "Seed: —" : "Seed: —";
  blackTextEl.textContent = t("blackTap");
  whiteHandEl.innerHTML = "";
  updateSelectedSlot();
  updateRoundDisplay();
  currentSeed = "";
  seedInput.value = "";
  btnGoToTable.disabled = true;
  btnStartRound.disabled = true;
  showStartButton();     // restore start button for next session
  closeShowcase();
  hideEndOverlay();
  showToast(t("toastExit"));
}

function buildBlackOrder() {
  if (!currentSeed || !blackCards.length) {
    blackOrder = [];
    return;
  }
  const rand = getRandFromSeed(currentSeed);
  blackOrder = seededShuffle(blackCards, rand);
  currentBlackIndex = 0;
}

function endGame() {
  gameEnded = true;
  gameStarted = false;
  autoAdvancePending = false;
  btnShowcase.disabled = true;
  hideStartButton();
  showEndOverlay();
  blackTextEl.textContent = lang === "en" ? "No black cards left." : "Keine schwarzen Karten mehr.";
  updateRoundDisplay();
}

function showEndOverlay() {
  endOverlay.classList.remove("hidden");
  endOverlay.classList.add("visible");
}

function hideEndOverlay() {
  endOverlay.classList.add("hidden");
  endOverlay.classList.remove("visible");
}

function replaySeed() {
  if (!currentSeed) return;
  buildBlackOrder();
  selectedWhite = "";
  updateSelectedSlot();
  gameEnded = false;
  gameStarted = false;
  btnShowcase.disabled = false;
  hideEndOverlay();
  startRound();
  updateRoundDisplay();
}

// --- Events ---
btnCreate.onclick = () => {
  currentSeed = genSeed();
  seedInput.value = currentSeed;
  currentBlackIndex = 0;
  buildBlackOrder();
  btnGoToTable.disabled = false;
  btnStartRound.disabled = false;
  btnShowcase.disabled = false;
  showStartButton();
  seedDisplay.textContent = currentSeed;
  currentSeedLabel.textContent = `Seed: ${currentSeed}`;
  updateRoundDisplay();
  showToast(t("toastCreated"));
};

btnJoin.onclick = () => {
  const seed = seedInput.value.trim().toUpperCase();
  if (!seed) {
    showToast(t("alertNeedSeed"), "warn");
    return;
  }
  currentSeed = seed;
  currentBlackIndex = 0;
  buildBlackOrder();
  btnGoToTable.disabled = false;
  btnStartRound.disabled = false;
  btnShowcase.disabled = false;
  showStartButton();
  seedDisplay.textContent = currentSeed;
  currentSeedLabel.textContent = `Seed: ${currentSeed}`;
  updateRoundDisplay();
  showToast(t("toastSet"));
};

btnCopy.onclick = async () => {
  if (!seedInput.value) return showToast(t("alertNeedSeed"), "warn");
  try {
    await navigator.clipboard.writeText(seedInput.value.trim());
    showToast(t("toastCopied"));
  } catch (e) {
    showToast("Copy failed; please copy manually.", "warn");
  }
};

btnCopyTop.onclick = () => btnCopy.onclick();

btnGoToTable.onclick = () => enterTable();

btnStartRound.onclick = () => startRound();

blackCardEl.onclick = () => {
  if (gameEnded) {
    showEndOverlay();
    return;
  }
  if (!currentSeed) {
    showToast(t("alertNeedSeed"), "warn");
    return;
  }
  if (!gameStarted) {
    startRound();
  } else {
    openShowcase(true); // require selected card before advancing
  }
};

btnExit.onclick = () => exitGame();

btnLang.onclick = () => {
  lang = lang === "en" ? "de" : "en";
  applyLocaleTexts();
};

btnShowcase.onclick = () => openShowcase(true);
btnNextRound.onclick = () => closeShowcase({ advance: true });
btnCancelShow.onclick = () => closeShowcase({ advance: false });
btnEndReplay.onclick = () => replaySeed();
btnEndExit.onclick = () => exitGame();
btnViewSource.onclick = () => window.open("https://github.com/jackzzso/cards-against-germanity", "_blank", "noopener,noreferrer");

// --- Init ---
applyLocaleTexts();
loadCards().then(() => {
  btnGoToTable.disabled = !currentSeed;
  btnStartRound.disabled = !currentSeed;
  if (currentSeed) buildBlackOrder();
  applyLocaleTexts();
});
renderBlackCard();
updateSelectedSlot();
btnShowcase.disabled = true;
updateRoundDisplay();
