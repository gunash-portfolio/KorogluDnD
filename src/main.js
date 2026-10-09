import * as THREE from "three";

const VERSES = [
  "I am Koroglu — son of the blinded man!",
  "Kırat and I ride so the hungry may eat!",
  "A brave heart does not steal from the poor!",
  "Justice is a sword that will not rust!",
  "Sing, ashik — let Bolu’s pride falter!",
];

const OPENING =
  "Episode I: hear Ali Kishi. Drive tax riders, the sergeant, the captain. Free Nigar — then talk with the band (your choices matter). Last riders. The gate.";

const INTRO = [
  {
    img: "/characters/ali-kishi.jpg",
    name: "Ali Kishi",
    text: "The groomsman told Bolu Bey the truth about a thin colt that would become Kırat. For that honesty they put out his eyes. Koroglu means son of the blind.",
  },
  {
    img: "/characters/koroglu.jpg",
    name: "Koroglu",
    text: "Ride Kırat — four hooves on the grass. Drive off tax riders, then the road sergeant, then the captain. The ashik heals. Free Nigar. Take Çamlıbel for the just.",
  },
];

const keys = new Set();
function bindKey(e, on) {
  const code = e.code || "";
  const map = {
    KeyW: "w",
    ArrowUp: "w",
    KeyS: "s",
    ArrowDown: "s",
    KeyA: "a",
    ArrowLeft: "a",
    KeyD: "d",
    ArrowRight: "d",
    Space: " ",
    KeyP: "p",
  };
  const name = map[code] || e.key.toLowerCase();
  if (on) keys.add(name);
  else keys.delete(name);
  if (map[code] || name === " ") e.preventDefault();
}
window.addEventListener("keydown", (e) => {
  if (state && (state.talking || state.loveTalk)) {
    const n = { Digit1: 0, Digit2: 1, Digit3: 2 }[e.code];
    if (n != null) {
      const sel = state.loveTalk ? "#outroChoices button" : "#talkChoices button";
      const btn = document.querySelectorAll(sel)[n];
      if (btn) {
        e.preventDefault();
        btn.click();
        return;
      }
    }
  }
  bindKey(e, true);
});
window.addEventListener("keyup", (e) => bindKey(e, false));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87a0b8);
scene.fog = new THREE.Fog(0x87a0b8, 40, 120);

scene.add(new THREE.AmbientLight(0xffe8c8, 1.1));
const sun = new THREE.DirectionalLight(0xfff0d0, 1.4);
sun.position.set(30, 40, 10);
sun.castShadow = false;
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(160, 160, 24, 24),
  new THREE.MeshLambertMaterial({ color: 0x4d6b3a, roughness: 0.95 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = false;
const pos = ground.geometry.attributes.position;
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i);
  const y = pos.getY(i);
  pos.setZ(i, Math.sin(x * 0.08) * 0.6 + Math.cos(y * 0.07) * 0.5);
}
pos.needsUpdate = true;
ground.geometry.computeVertexNormals();
scene.add(ground);

function box(w, h, d, color, x, y, z) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color, roughness: 0.8 })
  );
  m.position.set(x, y, z);
  m.castShadow = false;
  m.receiveShadow = false;
  scene.add(m);
  return m;
}

box(18, 10, 18, 0x6b5344, 0, 5, -28);
box(22, 2, 22, 0x5a4638, 0, 11, -28);
box(3, 8, 3, 0x4a3a30, -8, 15, -36);
box(3, 8, 3, 0x4a3a30, 8, 15, -36);
box(3, 8, 3, 0x4a3a30, -8, 15, -20);
box(3, 8, 3, 0x4a3a30, 8, 15, -20);
const gate = box(6, 6, 1.2, 0x2a1c12, 0, 3, -18.6);

for (let i = 0; i < 18; i++) {
  const t = box(0.6, 4 + Math.random() * 3, 0.6, 0x2f4a28, (Math.random() - 0.5) * 90, 2, (Math.random() - 0.5) * 90);
  t.position.y = 2.2;
}

function makeHorse(horseColor) {
  const g = new THREE.Group();
  const hide = new THREE.MeshLambertMaterial({ color: horseColor });
  const hoof = new THREE.MeshLambertMaterial({ color: 0x1a1208 });
  const leather = new THREE.MeshLambertMaterial({ color: 0x4a2c18 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.7, 0.62), hide);
  body.position.set(0.05, 0.82, 0);
  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.68, 0.58), hide);
  chest.position.set(0.72, 0.8, 0);
  const rump = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.66, 0.58), hide);
  rump.position.set(-0.78, 0.8, 0);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.72, 0.28), hide);
  neck.position.set(1.02, 1.18, 0);
  neck.rotation.z = -0.45;
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.26, 0.26), hide);
  head.position.set(1.32, 1.42, 0);
  const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.2), hide);
  muzzle.position.set(1.62, 1.34, 0);
  const earL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.08), hide);
  earL.position.set(1.18, 1.6, 0.08);
  const earR = earL.clone();
  earR.position.z = -0.08;
  const mane = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.18), hoof);
  mane.position.set(0.92, 1.28, 0);
  mane.rotation.z = -0.4;
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.62, 0.1), hoof);
  tail.position.set(-1.12, 0.78, 0);
  tail.rotation.z = 0.5;
  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.48), leather);
  saddle.position.set(0.08, 1.2, 0);
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.85, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  const legs = [];
  const posts = [
    [0.62, 0.2],
    [0.62, -0.2],
    [-0.72, 0.2],
    [-0.72, -0.2],
  ];
  for (const [lx, lz] of posts) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.64, 0.13), hoof);
    leg.position.set(lx, 0.32, lz);
    g.add(leg);
    legs.push(leg);
  }
  g.add(body, chest, rump, neck, head, muzzle, earL, earR, mane, tail, saddle, shadow);
  g.userData.legs = legs;
  return g;
}

function makeRider(bodyColor, sashColor, horseColor = 0x3b2416) {
  const g = new THREE.Group();
  const horse = makeHorse(horseColor);
  g.add(horse);
  g.userData.horse = horse;
  g.userData.last = new THREE.Vector3();
  scene.add(g);
  return g;
}

function gallop(mesh, t) {
  const horse = mesh.userData.horse;
  if (!horse) return;
  const last = mesh.userData.last;
  const moved = last.distanceTo(mesh.position) > 0.02;
  last.copy(mesh.position);
  const legs = horse.userData.legs || [];
  const a = moved ? Math.sin(t * 11) * 0.22 : 0;
  if (legs[0]) legs[0].rotation.z = a;
  if (legs[1]) legs[1].rotation.z = -a;
  if (legs[2]) legs[2].rotation.z = -a;
  if (legs[3]) legs[3].rotation.z = a;
  horse.position.y = moved ? Math.abs(Math.sin(t * 11)) * 0.05 : 0;
}

function makeWalker(bodyColor, sashColor) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.28, 0.7, 4, 8),
    new THREE.MeshLambertMaterial({ color: bodyColor })
  );
  body.position.y = 1.05;
  body.castShadow = false;
  const sash = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.12, 0.4),
    new THREE.MeshLambertMaterial({ color: sashColor })
  );
  sash.position.y = 1.05;
  body.visible = false;
  sash.visible = false;
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.4, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 })
  );
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.03;
  g.add(body, sash, disc);
  scene.add(g);
  return g;
}

const SPAWN = {
  player: [-6, 14],
  ally: [-16, 22],
  captain: [2, -10],
  tax1: [24, 10],
  tax2: [28, 2],
  sergeant: [6, 34],
  ayvaz: [12, 16],
  nigar: [-3, -16],
  remnant1: [-5, -22],
  remnant2: [5, -22],
};

function place(mesh, xy) {
  mesh.position.set(xy[0], 0, xy[1]);
  mesh.visible = true;
  if (mesh.userData.last) mesh.userData.last.set(xy[0], 0, xy[1]);
}

const playerMesh = makeRider(0xc9a227, 0x8b1e1e, 0x1a1a1a);
place(playerMesh, SPAWN.player);
const allyMesh = makeRider(0x3d6b4f, 0xd4c48a);
place(allyMesh, SPAWN.ally);
const enemyMesh = makeRider(0x6b1c1c, 0x222);
place(enemyMesh, SPAWN.captain);
const guard1Mesh = makeRider(0x5a1818, 0x111, 0x2a1510);
place(guard1Mesh, SPAWN.tax1);
const guard2Mesh = makeRider(0x4a1414, 0x1a0a0a, 0x241410);
place(guard2Mesh, SPAWN.tax2);
const sergeantMesh = makeRider(0x4a1010, 0x6a4a20, 0x2c1810);
place(sergeantMesh, SPAWN.sergeant);
const ayvazMesh = makeRider(0x4a6fa5, 0xe8d9a0, 0x5a3a22);
place(ayvazMesh, SPAWN.ayvaz);
const remnant1Mesh = makeRider(0x3a1010, 0x111, 0x221510);
place(remnant1Mesh, SPAWN.remnant1);
remnant1Mesh.visible = false;
const remnant2Mesh = makeRider(0x3a1010, 0x111, 0x221510);
place(remnant2Mesh, SPAWN.remnant2);
remnant2Mesh.visible = false;

const fatherMesh = makeWalker(0x8a7a62, 0x4a3a28);
fatherMesh.position.set(-14, 0, 18);
const nigarMesh = makeWalker(0xc4788a, 0xf0e0b0);
nigarMesh.position.set(-3, 0, -16);
const ashikMesh = makeWalker(0x5c3d8a, 0xc9a227);
ashikMesh.position.set(8, 0, 20);
const elderMesh = makeWalker(0x6a5a48, 0xb08a4a);
elderMesh.position.set(-18, 0, 8);

const speakers = [
  {
    id: "father",
    mesh: fatherMesh,
    line: "Ali Kishi: They took my eyes because I would not lie about the colt. Son — be brave, but be good. A tyrant fears a just man more than a strong one.",
  },
  {
    id: "elder",
    mesh: elderMesh,
    line: "Elder: Justice is not revenge. Protect the weak of this valley. If you ride only for anger, you become Bolu Bey. Take Çamlıbel for the people.",
  },
  {
    id: "ashik",
    mesh: ashikMesh,
    line: "Ashik: Stay by the saz. It will close your wounds. Recite so the poor remember they have a champion. A verse that defends them cuts deeper than steel.",
  },
  {
    id: "ayvaz",
    mesh: ayvazMesh,
    line: "Ayvaz: I will ride with you, Koroglu — as Ovez rode in the old tellings. Not for fame. The hungry should eat, and the cruel should answer.",
  },
  {
    id: "nigar",
    mesh: nigarMesh,
    line: "Nigar: Do not become the thing you hate. Free me, then free this land. Kindness is also courage — and Çamlıbel should be a home, not a trophy.",
  },
  {
    id: "hasan",
    mesh: allyMesh,
    line: "Deli Hasan: I ride at your shoulder. Say the word.",
  },
];

const DIALOGUES = {
  nigar: {
    who: "Nigar",
    start: "start",
    nodes: {
      start: {
        line: "You cut me free of Bolu’s captain. What now, son of the blind? The keep still has teeth.",
        choices: [
          { t: "Çamlıbel will be a home for the valley — not my prize.", next: "home", justice: 1, flag: "home" },
          { t: "I will make Bolu’s men pay in blood for every hour you were caged.", next: "blood", revenge: 1 },
          { t: "Walk with me. We ask the band before we take the gate.", next: "council" },
        ],
      },
      home: {
        line: "Then I walk beside you. A fortress that feeds the hungry is worth more than a throne.",
        choices: [{ t: "(Leave her in peace.)", next: null, done: true }],
      },
      blood: {
        line: "Anger kept me alive. Do not let it make you Bolu Bey with a kinder name.",
        choices: [{ t: "I hear you. I will speak with the others.", next: null, done: true }],
      },
      council: {
        line: "Good. Ali Kishi, the elder, the ashik, Ayvaz, Deli Hasan — they have voices. Use them.",
        choices: [{ t: "I will ride to them.", next: null, done: true }],
      },
    },
  },
  father: {
    who: "Ali Kishi",
    start: "start",
    nodes: {
      start: {
        line: "I cannot see the keep, son. Tell me what you mean to do with it.",
        choices: [
          { t: "Hold it for the poor. Your eyes were taken for truth — I will not trade that for glory.", next: "truth", justice: 1 },
          { t: "Burn their pride out. They blinded you. That debt is mine.", next: "debt", revenge: 1 },
          { t: "Stay behind the riders. I will not lose you again.", next: "safe" },
        ],
      },
      truth: {
        line: "Then you are still my son. A tyrant fears a just man more than a strong one.",
        choices: [{ t: "(Bow your head.)", next: null, done: true }],
      },
      debt: {
        line: "Debt is a chain. Cut theirs — do not forge your own.",
        choices: [{ t: "I will remember.", next: null, done: true }],
      },
      safe: {
        line: "I am already behind you. Ride. Be brave — and be good.",
        choices: [{ t: "(Squeeze his shoulder.)", next: null, done: true }],
      },
    },
  },
  elder: {
    who: "Village elder",
    start: "start",
    nodes: {
      start: {
        line: "The captain is dust. Last riders still clutch the gate. How do you enter Çamlıbel?",
        choices: [
          { t: "Offer quarter. Those who drop steel may live in the valley.", next: "quarter", justice: 1, flag: "mercy" },
          { t: "No quarter. Bolu taught us that language.", next: "noquarter", revenge: 1 },
          { t: "Let the ashik’s verse go first. Steel after song.", next: "song", flag: "verseFirst" },
        ],
      },
      quarter: {
        line: "Then you are not Bolu. Some will still fight. Meet them as men, not butchers.",
        choices: [{ t: "So I will.", next: null, done: true }],
      },
      noquarter: {
        line: "Then pray you never need mercy yourself.",
        choices: [{ t: "(Turn toward the keep.)", next: null, done: true }],
      },
      song: {
        line: "That is our old way. A verse that defends the poor cuts deeper than steel.",
        choices: [{ t: "I will recite at the gate.", next: null, done: true }],
      },
    },
  },
  ashik: {
    who: "The ashik",
    start: "start",
    nodes: {
      start: {
        line: "Nigar is free. Shall I sing of her rescue, or of the keep still unearned?",
        choices: [
          { t: "Sing of the hungry who will eat when the gate opens.", next: "hungry", justice: 1 },
          { t: "Sing so Bolu’s last riders lose their courage.", next: "fear", flag: "verseFirst" },
          { t: "Keep the saz for wounds. I need you alive more than famous.", next: "heal" },
        ],
      },
      hungry: {
        line: "Then the dastan stays honest. I will ride your shadow.",
        choices: [{ t: "(Nod.)", next: null, done: true }],
      },
      fear: {
        line: "A verse can break a line. I will be at the gate when you call.",
        choices: [{ t: "Call me when they close.", next: null, done: true }],
      },
      heal: {
        line: "The saz will still close your wounds. Come near when you bleed.",
        choices: [{ t: "I know the way.", next: null, done: true }],
      },
    },
  },
  ayvaz: {
    who: "Ayvaz",
    start: "start",
    nodes: {
      start: {
        line: "Ovez in the old tellings was taken and saved. You saved Nigar. Do I still ride for justice — or for your anger?",
        choices: [
          { t: "For the hungry. Always. You are not a trophy hunter.", next: "hungry", justice: 1 },
          { t: "For the debt. Ride and do not ask.", next: "debt", revenge: 1 },
          { t: "Ride as my brother. That is enough.", next: "brother" },
        ],
      },
      hungry: {
        line: "Then my mind is yours at the keep.",
        choices: [{ t: "(Grip his arm.)", next: null, done: true }],
      },
      debt: {
        line: "I will still strike. But I will watch you, Koroglu.",
        choices: [{ t: "Watch, then.", next: null, done: true }],
      },
      brother: {
        line: "Brother is a heavier word than bey. I will not drop it.",
        choices: [{ t: "Nor I.", next: null, done: true }],
      },
    },
  },
  hasan: {
    who: "Deli Hasan",
    start: "start",
    nodes: {
      start: {
        line: "The captain fell. I still have a saber. Point me.",
        choices: [
          { t: "Guard Nigar. If I become a tyrant, stop me.", next: "guard", justice: 1 },
          { t: "Break the last riders. Leave none standing.", next: "break", revenge: 1 },
          { t: "Stay on my right. As you always have.", next: "right" },
        ],
      },
      guard: {
        line: "Then I ride two duties: her life, and your soul.",
        choices: [{ t: "Both.", next: null, done: true }],
      },
      break: {
        line: "I will. Do not ask me later why the grass is red.",
        choices: [{ t: "Ride.", next: null, done: true }],
      },
      right: {
        line: "Always. Say verse or steel — I answer.",
        choices: [{ t: "(Mount up.)", next: null, done: true }],
      },
    },
  },
};

const GATE_LOVE = {
  start: "nigar1",
  nodes: {
    nigar1: {
      who: "Nigar",
      line: "Koroglu — I heard Kırat before I saw your face. Hold me. The cage is gone, and I will not spend this hour as a trophy.",
      choices: [
        { t: "I rode for you. The keep can wait a breath.", next: "koro1" },
        { t: "Your name was a verse I would not let die.", next: "koro1" },
        { t: "Stay against my heart. Steel is done.", next: "koro2" },
      ],
    },
    koro1: {
      who: "Koroglu",
      line: "I am still the son of the blind — yet my eyes found you. If Çamlıbel is a home, it is because you walk in it.",
      choices: [{ t: "Nigar, walk the valley with me as my equal.", next: "nigar2" }],
    },
    koro2: {
      who: "Koroglu",
      line: "Then let Bolu’s drums go quiet. I wanted justice — and I wanted you. Both, or the dastan is a lie.",
      choices: [{ t: "Say you choose me, not the rescue.", next: "nigar2" }],
    },
    nigar2: {
      who: "Nigar",
      line: "I choose you — not as a rescued prize, but as a woman who loves a just man. Kiss me at the green gate, and let the valley hear it.",
      choices: [
        { t: "Then this keep is ours: a home, not a throne.", next: "together" },
        { t: "I love you, Nigar. Let the ashik write that verse too.", next: "together" },
      ],
    },
    together: {
      who: "At the gate",
      line: "They hold each other in the last light. Love is not weakness in a champion. The dastan remembers saber — and this quiet.",
      choices: [{ t: "Hear Nigar’s last word.", next: "good" }],
    },
    good: {
      who: "Nigar — Good ending",
      line: "Then hear me, Koroglu: I am not a prize you won. I am the woman who chooses you. Kiss me at the green gate. Let Çamlıbel feed the hungry, and let the valley live without fear.",
      choices: [
        { t: "I love you. The keep is a home. This is our good ending.", next: "close", goodEnd: true },
      ],
    },
    close: {
      who: "Koroglu",
      line: "Equal at the gate — saber, verse, and you. The ashik will write both: justice for the poor, and this love. Çamlıbel is a home again.",
      choices: [{ t: "Close the tale.", next: null, done: true, goodEnd: true }],
    },
  },
};

const sword = new THREE.Mesh(
  new THREE.BoxGeometry(0.12, 0.12, 1.3),
  new THREE.MeshLambertMaterial({ color: 0xc0c8d0, metalness: 0.7, roughness: 0.3 })
);
sword.position.set(0.45, 1.45, 0.55);
playerMesh.add(sword);

let state = createState();

function createState() {
  return {
    intro: true,
    over: false,
    win: false,
    verseIndex: 0,
    verseCooldown: 0,
    swordT: 0,
    swordHit: false,
    heard: {},
    lastTalk: 0,
    ayvazJoined: false,
    nigarFree: false,
    talking: null,
    talkNode: "start",
    talked: {},
    loveTalk: false,
    loveNode: "nigar1",
    goodEnding: false,
    goodEndingShown: false,
    justice: 0,
    revenge: 0,
    flags: {},
    episode: 1,
    player: { hp: 100, speed: 8, yaw: 0 },
    ally: { hp: 80, attackCd: 0, speed: 6.2, dmg: 9, cd: 0.9 },
    ayvaz: { hp: 70, attackCd: 0, speed: 5.8, dmg: 7, cd: 1.0 },
    enemy: { hp: 120, maxHp: 120, attackCd: 0, demoralized: 0, speed: 5.2, dmg: 12, cd: 0.85, ep: 3 },
    sergeant: { hp: 80, maxHp: 80, attackCd: 0, demoralized: 0, speed: 5.5, dmg: 10, cd: 0.9, ep: 2 },
    guards: [
      { hp: 50, maxHp: 50, attackCd: 0, demoralized: 0, speed: 5.4, dmg: 8, cd: 1.0, ep: 1 },
      { hp: 50, maxHp: 50, attackCd: 0, demoralized: 0, speed: 5.4, dmg: 8, cd: 1.0, ep: 1 },
    ],
    remnants: [
      { hp: 70, maxHp: 70, attackCd: 0, demoralized: 0, speed: 5.3, dmg: 9, cd: 0.95, ep: 5 },
      { hp: 70, maxHp: 70, attackCd: 0, demoralized: 0, speed: 5.3, dmg: 9, cd: 0.95, ep: 5 },
    ],
    ashikVerseCd: 0,
    ashikHealCd: 0,
    autoplay: true,
    autoT: 0,
  };
}

const playerFill = document.getElementById("playerFill");
const allyFill = document.getElementById("allyFill");
const enemyFill = document.getElementById("enemyFill");
const banner = document.getElementById("banner");
const bannerTitle = document.getElementById("bannerTitle");
const bannerText = document.getElementById("bannerText");
const story = document.getElementById("story");
const chapterEl = document.getElementById("chapter");

const outroEl = document.getElementById("outro");
const outroArt = document.getElementById("outroArt");

document.getElementById("restart").onclick = () => {
  state = createState();
  state.intro = false;
  state.autoplay = false;
  place(playerMesh, SPAWN.player);
  place(allyMesh, SPAWN.ally);
  place(enemyMesh, SPAWN.captain);
  place(guard1Mesh, SPAWN.tax1);
  place(guard2Mesh, SPAWN.tax2);
  place(sergeantMesh, SPAWN.sergeant);
  place(ayvazMesh, SPAWN.ayvaz);
  nigarMesh.position.set(SPAWN.nigar[0], 0, SPAWN.nigar[1]);
  nigarMesh.visible = true;
  place(remnant1Mesh, SPAWN.remnant1);
  remnant1Mesh.visible = false;
  place(remnant2Mesh, SPAWN.remnant2);
  remnant2Mesh.visible = false;
  closeTalk();
  closeGateLove();
  banner.classList.remove("show");
  outroEl.classList.remove("show");
  if (outroName) outroName.textContent = "Çamlıbel is a home again";
  if (outroText) {
    outroText.style.display = "";
    outroText.textContent =
      "Nigar is free. Speak with her at the gate. Love is not a trophy: if you answer her as an equal, the tale closes on a good ending — Çamlıbel as a home, not a throne.";
  }
  story.textContent = OPENING;
  setChapter("Episode I — Tax riders of Bolu Bey");
  setEnemyLabel();
  gate.material.color.set(0x2a1c12);
  hasRideGoal = false;
};

function setChapter(text) {
  if (chapterEl) chapterEl.textContent = text;
}

function setEnemyLabel() {
  const el = document.getElementById("enemyLabel");
  if (!el) return;
  if (state.episode <= 1) el.textContent = "Tax riders";
  else if (state.episode === 2) el.textContent = "Road sergeant";
  else if (state.episode === 3) el.textContent = "Captain of Bolu Bey";
  else if (state.episode === 4) el.textContent = "Counsel (talk)";
  else if (state.episode === 5) el.textContent = "Last riders of the keep";
  else el.textContent = "The gate";
}

function showWinBanner() {
  if (state.goodEnding) {
    bannerTitle.textContent = "Good ending";
    bannerText.textContent =
      "Nigar spoke her love at the green gate. Koroglu answered as her equal, not her captor. Çamlıbel is a home. The dastan remembers saber, verse, and this quiet.";
    banner.classList.add("show");
    return;
  }
  const just = (state.justice || 0) >= (state.revenge || 0);
  bannerTitle.textContent = just ? "Justice rides at Çamlıbel" : "The keep is taken";
  bannerText.textContent = just
    ? "Nigar is free. Your words chose a home, not a trophy. The weak may live without fear. That is the dastan: bravery yoked to justice."
    : "Nigar is free and the last riders fall. Anger opened the gate. The elder will remember what you chose — and so will the valley.";
  banner.classList.add("show");
}

const talkEl = document.getElementById("talk");
const talkWho = document.getElementById("talkWho");
const talkLine = document.getElementById("talkLine");
const talkChoices = document.getElementById("talkChoices");

function closeTalk() {
  state.talking = null;
  if (talkEl) talkEl.classList.remove("show");
}

function councilReady() {
  const n = Object.keys(state.talked || {}).length;
  return Boolean(state.talked.nigar && n >= 3);
}

function maybeEpisodeFive() {
  if (state.episode !== 4 || !councilReady()) return;
  state.episode = 5;
  const extra = (state.revenge || 0) > (state.justice || 0) ? 25 : 0;
  for (const r of state.remnants) {
    r.hp = r.maxHp + extra;
    r.maxHp = r.hp;
  }
  remnant1Mesh.visible = true;
  remnant2Mesh.visible = true;
  setEnemyLabel();
  setChapter("Episode V — Last riders of the keep");
  story.textContent = state.flags.mercy
    ? "You offered quarter. Those who still raise steel must be met. Ride the keep."
    : "Bolu’s last riders clutch Çamlıbel. Talk is done. Take the gate with saber and verse.";
}

function renderTalk() {
  const pack = DIALOGUES[state.talking];
  if (!pack || !talkEl) return;
  const node = pack.nodes[state.talkNode];
  if (!node) {
    closeTalk();
    return;
  }
  talkWho.textContent = pack.who;
  talkLine.textContent = node.line;
  talkChoices.innerHTML = "";
  node.choices.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = `${i + 1}. ${c.t}`;
    b.onclick = () => pickTalk(c);
    talkChoices.appendChild(b);
  });
  talkEl.classList.add("show");
}

function openTalk(id) {
  if (!DIALOGUES[id] || state.talked[id]) return;
  if (id !== "nigar" && !state.nigarFree) return;
  if (id === "nigar" && state.enemy.hp > 0) return;
  stopAutoplay();
  state.talking = id;
  state.talkNode = DIALOGUES[id].start;
  hasRideGoal = false;
  renderTalk();
}

function pickTalk(c) {
  if (c.justice) state.justice += c.justice;
  if (c.revenge) state.revenge += c.revenge;
  if (c.flag) state.flags[c.flag] = true;
  if (c.done || c.next == null) {
    state.talked[state.talking] = true;
    const who = DIALOGUES[state.talking].who;
    closeTalk();
    story.textContent = `You spoke with ${who}. Ride another of the band, then the keep.`;
    maybeEpisodeFive();
    return;
  }
  state.talkNode = c.next;
  renderTalk();
}

function nearestTalkId() {
  let best = null;
  let bestD = 3.4;
  for (const s of speakers) {
    if (!DIALOGUES[s.id] || state.talked[s.id]) continue;
    if (s.id === "nigar" && state.enemy.hp > 0) continue;
    if (s.id !== "nigar" && !state.nigarFree) continue;
    const d = dist(playerMesh, s.mesh);
    if (d < bestD) {
      bestD = d;
      best = s.id;
    }
  }
  return best;
}

const outroName = document.getElementById("outroName");
const outroText = document.getElementById("outroText");
const outroTalk = document.getElementById("outroTalk");
const outroWho = document.getElementById("outroWho");
const outroLine = document.getElementById("outroLine");
const outroChoices = document.getElementById("outroChoices");
const outroContinue = document.getElementById("outroContinue");

function closeGateLove() {
  state.loveTalk = false;
  state.loveNode = GATE_LOVE.start;
  if (outroTalk) outroTalk.classList.remove("show");
  if (outroText) outroText.style.display = "";
  if (outroName) outroName.textContent = "Çamlıbel is a home again";
  if (outroContinue) {
    outroContinue.style.display = "";
    outroContinue.textContent = state.goodEndingShown ? "Close the tale" : "Speak with Nigar";
  }
}

function renderGateLove() {
  const node = GATE_LOVE.nodes[state.loveNode];
  if (!node || !outroTalk) {
    finishGateLove();
    return;
  }
  if (outroText) outroText.style.display = "none";
  if (outroContinue) outroContinue.style.display = "none";
  outroWho.textContent = node.who;
  outroLine.textContent = node.line;
  outroChoices.innerHTML = "";
  node.choices.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = `${i + 1}. ${c.t}`;
    b.onclick = () => pickGateLove(c);
    outroChoices.appendChild(b);
  });
  outroTalk.classList.add("show");
}

function pickGateLove(c) {
  if (c.goodEnd) state.goodEnding = true;
  if (c.done || c.next == null) {
    finishGateLove();
    return;
  }
  state.loveNode = c.next;
  renderGateLove();
}

function showGoodEndingCard() {
  state.goodEnding = true;
  state.goodEndingShown = true;
  state.loveTalk = false;
  if (outroTalk) outroTalk.classList.remove("show");
  if (outroName) outroName.textContent = "Good ending";
  if (outroText) {
    outroText.style.display = "";
    outroText.textContent =
      "Nigar speaks at the green gate. Koroglu answers as her equal — not her captor. Love and justice close the dastan together. Çamlıbel is a home again.";
  }
  if (outroContinue) {
    outroContinue.style.display = "";
    outroContinue.textContent = "Close the tale";
  }
}

function finishGateLove() {
  showGoodEndingCard();
}

outroContinue.onclick = () => {
  if (state.goodEndingShown) {
    closeGateLove();
    outroEl.classList.remove("show");
    showWinBanner();
    return;
  }
  state.loveTalk = true;
  state.loveNode = GATE_LOVE.start;
  renderGateLove();
};

function endGame(win) {
  state.over = true;
  state.win = win;
  if (win) {
    state.goodEndingShown = false;
    closeGateLove();
    outroArt.style.animation = "none";
    void outroArt.offsetWidth;
    outroArt.style.animation = "outroIn 1.6s ease both";
    outroEl.classList.add("show");
  } else {
    bannerTitle.textContent = "The ride ends";
    bannerText.textContent =
      "Courage without care is not enough. Rise again. Hear Ali Kishi. Be brave — and be just.";
    banner.classList.add("show");
  }
}

function dist(a, b) {
  return a.position.distanceTo(b.position);
}

function moveToward(mesh, target, speed, dt, stopAt = 1.6) {
  const d = dist(mesh, target);
  if (d < stopAt) return;
  const dir = target.position.clone().sub(mesh.position);
  dir.y = 0;
  dir.normalize();
  mesh.position.addScaledVector(dir, speed * dt);
  mesh.rotation.y = Math.atan2(dir.x, dir.z);
}

function moveAway(mesh, from, speed, dt) {
  const dir = mesh.position.clone().sub(from.position);
  dir.y = 0;
  if (dir.lengthSq() < 0.01) dir.set(1, 0, 0);
  dir.normalize();
  mesh.position.addScaledVector(dir, speed * dt);
  mesh.rotation.y = Math.atan2(dir.x, dir.z);
  mesh.position.x = THREE.MathUtils.clamp(mesh.position.x, -55, 55);
  mesh.position.z = THREE.MathUtils.clamp(mesh.position.z, -55, 55);
}

function nearestFoe(from, foes) {
  let best = null;
  let bestD = 1e9;
  for (const f of foes) {
    if (f.hp <= 0) continue;
    const d = dist(from, f.mesh);
    if (d < bestD) {
      bestD = d;
      best = f;
    }
  }
  return best;
}

function thinkAlly(dt, actor, foes, protectMesh) {
  if (actor.hp <= 0) return;
  actor.attackCd -= dt;
  const threatOnProtect = nearestFoe(protectMesh, foes);
  let target = nearestFoe(actor.mesh, foes);
  if (threatOnProtect && dist(protectMesh, threatOnProtect.mesh) < 12) {
    target = threatOnProtect;
  }
  if (!target) {
    moveToward(actor.mesh, protectMesh, actor.speed, dt, 2.5);
    return;
  }
  moveToward(actor.mesh, target.mesh, actor.speed, dt, 1.7);
  if (dist(actor.mesh, target.mesh) < 2.2 && actor.attackCd <= 0) {
    target.hp -= actor.dmg;
    actor.attackCd = actor.cd;
  }
}

function thinkEnemy(dt, actor, friends, slowed) {
  if (actor.hp <= 0) return;
  actor.attackCd -= dt;
  const speed = slowed ? actor.speed * 0.42 : actor.speed;
  let target = nearestFoe(actor.mesh, friends);
  const captainHurt = friends.find((f) => f.role === "player" && f.hp < 50);
  if (captainHurt) target = captainHurt;
  const allyThreat = nearestFoe(enemyMesh, friends);
  if (allyThreat && dist(enemyMesh, allyThreat.mesh) < 8 && actor !== state.enemy) {
    target = allyThreat;
  }
  if (!target) return;
  moveToward(actor.mesh, target.mesh, speed, dt, 1.7);
  if (dist(actor.mesh, target.mesh) < 2.0 && actor.attackCd <= 0) {
    target.hp -= actor.dmg;
    actor.attackCd = actor.cd;
  }
}

const rideGoal = new THREE.Vector3();
let hasRideGoal = false;
let verseQueued = false;
let last = performance.now();
let pointerDown = false;

const map2d = document.getElementById("map2d");
const mapCtx = map2d.getContext("2d");

function setRideGoal(clientX, clientY) {
  const rect = map2d.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  rideGoal.x = ((clientX - rect.left) / rect.width) * 110 - 55;
  rideGoal.z = ((clientY - rect.top) / rect.height) * 110 - 55;
  rideGoal.y = 0;
  hasRideGoal = true;
  story.textContent =
    "You ride. Episode I tax riders, II the sergeant, III the captain, IV Nigar and the gate. Hear the people as you go.";
}

function stopAutoplay() {
  state.autoplay = false;
}

window.addEventListener("pointerdown", (e) => {
  if (state.intro) return;
  if (e.target.closest("#pad") || e.target.closest("button") || e.target.closest("#intro") || e.target.closest("#talk")) return;
  stopAutoplay();
  pointerDown = true;
  setRideGoal(e.clientX, e.clientY);
});

for (const btn of document.querySelectorAll("#pad [data-dir]")) {
  const dir = btn.getAttribute("data-dir");
  btn.addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    const dirs = ["w", "a", "s", "d"];
    if (keys.has(dir)) {
      keys.delete(dir);
    } else {
      for (const d of dirs) keys.delete(d);
      keys.add(dir);
    }
    hasRideGoal = false;
    stopAutoplay();
  });
}
document.getElementById("btnSword").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  stopAutoplay();
  pointerDown = true;
});
document.getElementById("btnVerse").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  stopAutoplay();
  verseQueued = true;
});
document.getElementById("btnTalk").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  stopAutoplay();
  const id = nearestTalkId();
  if (id) openTalk(id);
  else story.textContent = state.nigarFree
    ? "Ride closer to Nigar, Ali Kishi, the elder, the ashik, Ayvaz, or Deli Hasan."
    : "Free Nigar first. Then the band will speak with choices.";
});

function toMap(mesh, w, h) {
  return [((mesh.position.x + 55) / 110) * w, ((mesh.position.z + 55) / 110) * h];
}

function keyBackground(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const p = data.data;
  for (let i = 0; i < p.length; i += 4) {
    const r = p[i];
    const g = p[i + 1];
    const b = p[i + 2];
    const hotPink =
      r >= 165 && g <= 140 && b >= 100 && r - g > 40 && b - g > 20 && r + b > 300;
    if (hotPink) p[i + 3] = 0;
  }
  ctx.putImageData(data, 0, 0);
  canvas.complete = true;
  canvas.naturalWidth = canvas.width;
  canvas.naturalHeight = canvas.height;
  return canvas;
}

function loadArt(src) {
  const holder = document.createElement("canvas");
  holder.complete = false;
  holder.naturalWidth = 0;
  const img = new Image();
  img.onload = () => {
    const keyed = keyBackground(img);
    holder.width = keyed.width;
    holder.height = keyed.height;
    holder.getContext("2d").drawImage(keyed, 0, 0);
    holder.complete = true;
    holder.naturalWidth = holder.width;
    holder.naturalHeight = holder.height;
    try {
      holder._png = holder.toDataURL("image/png");
    } catch {
      holder._png = "";
    }
    for (const fn of holder._onreadies || []) fn();
    if (window.__refreshIntro) window.__refreshIntro();
  };
  img.src = src;
  return holder;
}
const korogluArt = loadArt("/characters/koroglu.jpg");
const hasanArt = loadArt("/characters/deli-hasan.jpg");
const captainArt = loadArt("/characters/captain.jpg");
const ayvazArt = loadArt("/characters/ayvaz.jpg");
const fatherArt = loadArt("/characters/ali-kishi.jpg");
const nigarArt = loadArt("/characters/nigar.jpg");
const ashikArt = loadArt("/characters/ashik.jpg");
const elderArt = loadArt("/characters/elder.jpg");

function drawLowPolyHorse(x, y, yaw, color) {
  mapCtx.save();
  mapCtx.translate(x, y + 6);
  mapCtx.rotate(yaw);
  mapCtx.fillStyle = "rgba(0,0,0,0.28)";
  mapCtx.beginPath();
  mapCtx.ellipse(0, 14, 22, 7, 0, 0, Math.PI * 2);
  mapCtx.fill();
  mapCtx.fillStyle = "#1a1208";
  mapCtx.fillRect(-16, 2, 6, 16);
  mapCtx.fillRect(-6, 2, 6, 16);
  mapCtx.fillRect(8, 2, 6, 16);
  mapCtx.fillRect(16, 2, 6, 16);
  mapCtx.fillStyle = color;
  mapCtx.beginPath();
  mapCtx.moveTo(-24, 0);
  mapCtx.lineTo(16, -10);
  mapCtx.lineTo(24, -4);
  mapCtx.lineTo(18, 8);
  mapCtx.lineTo(-18, 10);
  mapCtx.closePath();
  mapCtx.fill();
  mapCtx.beginPath();
  mapCtx.moveTo(16, -10);
  mapCtx.lineTo(30, -16);
  mapCtx.lineTo(34, -6);
  mapCtx.lineTo(20, 0);
  mapCtx.closePath();
  mapCtx.fill();
  mapCtx.fillStyle = "#1a1208";
  mapCtx.fillRect(-26, -2, 8, 4);
  mapCtx.restore();
}

function drawPortrait(x, y, img, fallback, name, scale = 1) {
  const h = 90 * scale;
  const w = h * 0.68;
  mapCtx.save();
  mapCtx.fillStyle = "rgba(0,0,0,0.28)";
  mapCtx.beginPath();
  mapCtx.ellipse(x, y + 20 * scale, 16 * scale, 7 * scale, 0, 0, Math.PI * 2);
  mapCtx.fill();
  mapCtx.translate(x, y - 18 * scale);
  if (img.complete && img.naturalWidth) {
    mapCtx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    mapCtx.fillStyle = fallback;
    mapCtx.fillRect(-w / 2, -h / 2, w, h);
  }
  mapCtx.restore();
  mapCtx.fillStyle = "#fff4d4";
  mapCtx.fillText(name, x, y - 68 * scale);
}

function drawMountedArt(x, y, yaw, img, horseColor, fallback, name) {
  drawLowPolyHorse(x, y, yaw, horseColor);
  drawPortrait(x, y - 10, img, fallback, name, 0.72);
}

function drawMap() {
  const w = Math.max(window.innerWidth, 1);
  const h = Math.max(window.innerHeight, 1);
  if (map2d.width !== w || map2d.height !== h) {
    map2d.width = w;
    map2d.height = h;
  }
  mapCtx.fillStyle = "#3d5a32";
  mapCtx.fillRect(0, 0, w, h);
  mapCtx.fillStyle = "#6b5344";
  mapCtx.fillRect(w * 0.38, h * 0.18, w * 0.24, h * 0.22);
  mapCtx.fillStyle = "#2a1c12";
  mapCtx.fillRect(w * 0.46, h * 0.36, w * 0.08, h * 0.04);
  mapCtx.font = "14px Georgia";
  mapCtx.textAlign = "center";
  const figures = [
    { mesh: allyMesh, img: hasanArt, horse: "#3b2416", fb: "#3a8", name: "Deli Hasan", mounted: true },
    { mesh: playerMesh, img: korogluArt, horse: "#1a1a1a", fb: "#c9a227", name: "Koroglu", mounted: true },
    { mesh: enemyMesh, img: captainArt, horse: "#3a1a12", fb: "#a33", name: "Captain", mounted: true },
    { mesh: guard1Mesh, img: captainArt, horse: "#2a1510", fb: "#822", name: "Tax rider", mounted: true },
    { mesh: guard2Mesh, img: captainArt, horse: "#241410", fb: "#822", name: "Tax rider", mounted: true },
    { mesh: sergeantMesh, img: captainArt, horse: "#2c1810", fb: "#933", name: "Sergeant", mounted: true },
    { mesh: remnant1Mesh, img: captainArt, horse: "#221510", fb: "#622", name: "Last rider", mounted: true },
    { mesh: remnant2Mesh, img: captainArt, horse: "#221510", fb: "#622", name: "Last rider", mounted: true },
    { mesh: ayvazMesh, img: ayvazArt, horse: "#5a3a22", fb: "#4a6fa5", name: "Ayvaz", mounted: true },
    { mesh: fatherMesh, img: fatherArt, horse: null, fb: "#d8c8a8", name: "Ali Kishi", mounted: false },
    { mesh: nigarMesh, img: nigarArt, horse: null, fb: "#c4788a", name: "Nigar", mounted: false },
    { mesh: ashikMesh, img: ashikArt, horse: null, fb: "#5c3d8a", name: "Ashik", mounted: false },
    { mesh: elderMesh, img: elderArt, horse: null, fb: "#b08a4a", name: "Elder", mounted: false },
  ].sort((a, b) => a.mesh.position.z - b.mesh.position.z);
  for (const f of figures) {
    if (!f.mesh.visible) continue;
    const [x, y] = toMap(f.mesh, w, h);
    if (f.mounted) drawMountedArt(x, y, f.mesh.rotation.y, f.img, f.horse, f.fb, f.name);
    else drawPortrait(x, y, f.img, f.fb, f.name, 0.92);
  }
  if (hasRideGoal) {
    const gx = ((rideGoal.x + 55) / 110) * w;
    const gy = ((rideGoal.z + 55) / 110) * h;
    mapCtx.strokeStyle = "#c9a227";
    mapCtx.beginPath();
    mapCtx.arc(gx, gy, 8, 0, Math.PI * 2);
    mapCtx.stroke();
  }
}

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (state.intro) {
    drawMap();
    return;
  }

  if (!state.over && !state.talking) {
    if (state.autoplay) {
      state.autoT += dt;
      const t = state.autoT;
      let target = fatherMesh;
      if (t >= 5 && t < 11) target = ashikMesh;
      else if (t >= 11 && t < 16) target = ayvazMesh;
      else if (t >= 16) target = guard1Mesh;
      rideGoal.copy(target.position);
      hasRideGoal = true;
      if (t > 16.2 && t < 16.5) verseQueued = true;
      if (t > 18 && dist(playerMesh, guard1Mesh) < 3.2) pointerDown = true;
    }
    let mx = 0;
    let mz = 0;
    if (keys.has("w") || keys.has("arrowup")) mz -= 1;
    if (keys.has("s") || keys.has("arrowdown")) mz += 1;
    if (keys.has("a") || keys.has("arrowleft")) mx -= 1;
    if (keys.has("d") || keys.has("arrowright")) mx += 1;
    if (mx || mz) {
      stopAutoplay();
      hasRideGoal = false;
      const len = Math.hypot(mx, mz);
      mx /= len;
      mz /= len;
      playerMesh.position.x += mx * state.player.speed * dt;
      playerMesh.position.z += mz * state.player.speed * dt;
      state.player.yaw = Math.atan2(mx, mz);
      playerMesh.rotation.y = state.player.yaw;
    } else if (hasRideGoal) {
      const dx = rideGoal.x - playerMesh.position.x;
      const dz = rideGoal.z - playerMesh.position.z;
      const len = Math.hypot(dx, dz);
      if (len < 0.6) hasRideGoal = false;
      else {
        playerMesh.position.x += (dx / len) * state.player.speed * dt;
        playerMesh.position.z += (dz / len) * state.player.speed * dt;
        state.player.yaw = Math.atan2(dx, dz);
        playerMesh.rotation.y = state.player.yaw;
      }
    }
    playerMesh.position.x = THREE.MathUtils.clamp(playerMesh.position.x, -55, 55);
    playerMesh.position.z = THREE.MathUtils.clamp(playerMesh.position.z, -55, 55);

    state.player.mesh = playerMesh;
    state.ally.mesh = allyMesh;
    state.ayvaz.mesh = ayvazMesh;
    state.enemy.mesh = enemyMesh;
    state.sergeant.mesh = sergeantMesh;
    state.guards[0].mesh = guard1Mesh;
    state.guards[1].mesh = guard2Mesh;

    const justice = Boolean(state.heard.father && state.heard.elder);
    const swordDmg = justice ? 28 : 22;

    const swinging = keys.has(" ") || pointerDown;
    pointerDown = false;
    if (swinging && state.swordT <= 0) {
      state.swordT = 0.28;
      state.swordHit = false;
    }
    const hostileUnits = () =>
      [
        Object.assign(state.guards[0], { mesh: guard1Mesh }),
        Object.assign(state.guards[1], { mesh: guard2Mesh }),
        Object.assign(state.sergeant, { mesh: sergeantMesh }),
        Object.assign(state.enemy, { mesh: enemyMesh }),
        Object.assign(state.remnants[0], { mesh: remnant1Mesh }),
        Object.assign(state.remnants[1], { mesh: remnant2Mesh }),
      ].filter((u) => u.hp > 0 && state.episode >= u.ep);
    const friendUnits = () => {
      const list = [
        Object.assign(state.player, { mesh: playerMesh, role: "player" }),
        Object.assign(state.ally, { mesh: allyMesh }),
      ];
      if (state.ayvazJoined) list.push(Object.assign(state.ayvaz, { mesh: ayvazMesh }));
      return list;
    };

    if (state.swordT > 0) {
      state.swordT -= dt;
      sword.rotation.y = Math.sin((0.28 - state.swordT) * 12) * 1.1;
      if (!state.swordHit) {
        const hit = nearestFoe(playerMesh, hostileUnits());
        if (hit && dist(playerMesh, hit.mesh) < 2.5) {
          hit.hp -= swordDmg;
          state.swordHit = true;
        }
      }
    } else {
      sword.rotation.y = 0;
    }

    state.verseCooldown -= dt;
    if ((keys.has("p") || verseQueued) && state.verseCooldown <= 0) {
      verseQueued = false;
      state.verseCooldown = 3.5;
      for (const u of [state.enemy, state.sergeant, state.guards[0], state.guards[1], ...state.remnants]) {
        u.demoralized = state.flags.verseFirst ? 3.6 : 2.8;
      }
      const line = VERSES[state.verseIndex % VERSES.length];
      state.verseIndex += 1;
      story.textContent = `Poetry combat: “${line}” — Bolu’s riders falter.`;
    }

    state.lastTalk -= dt;
    if (state.lastTalk <= 0) {
      for (const s of speakers) {
        if (dist(playerMesh, s.mesh) >= 3.2) continue;
        const choiceTalk =
          DIALOGUES[s.id] && (state.nigarFree || (s.id === "nigar" && state.enemy.hp <= 0));
        if (choiceTalk) {
          if (!state.talked[s.id]) {
            story.textContent = `${DIALOGUES[s.id].who} will speak. Press Talk and choose.`;
            if (s.id === "nigar" && !state.talked.nigar) openTalk("nigar");
          }
          state.lastTalk = 1.2;
          break;
        }
        story.textContent = s.line;
        state.heard[s.id] = true;
        state.lastTalk = 2.4;
        if (s.id === "ayvaz") {
          state.ayvazJoined = true;
          setChapter("Episode II — Ayvaz joins the band");
        }
        if (s.id === "nigar" && state.enemy.hp <= 0) state.nigarFree = true;
        if (s.id === "father" && !state.heard.fatherBless) {
          state.heard.fatherBless = true;
          state.player.hp = Math.min(100, state.player.hp + 12);
          setChapter("Episode I — The blinded groomsman");
        }
        if (s.id === "elder") setChapter("Episode I — Justice, not revenge");
        if (s.id === "ashik") setChapter("The ashik’s saz");
        break;
      }
    }

    thinkAlly(dt, state.ally, hostileUnits(), playerMesh);
    if (state.ayvazJoined) thinkAlly(dt, state.ayvaz, hostileUnits(), playerMesh);

    state.ashikHealCd -= dt;
    if (dist(playerMesh, ashikMesh) < 4.2 && state.ashikHealCd <= 0) {
      const healed = state.player.hp < 100 || state.ally.hp < 80;
      state.player.hp = Math.min(100, state.player.hp + 10);
      if (state.ally.hp > 0) state.ally.hp = Math.min(80, state.ally.hp + 8);
      state.ashikHealCd = 1.25;
      if (healed) {
        story.textContent = "The ashik’s saz mends your wounds. Stay near him to recover, then ride.";
        setChapter("The ashik heals");
      }
    }

    state.ashikVerseCd -= dt;
    if (state.ashikVerseCd <= 0 && dist(ashikMesh, playerMesh) < 14 && dist(ashikMesh, enemyMesh) < 18) {
      state.enemy.demoralized = Math.max(state.enemy.demoralized, 1.6);
      state.ashikVerseCd = 6;
      story.textContent = "The ashik’s saz bites the captain’s courage. Allies fight with you; his riders fight for him.";
    }

    const threat = nearestFoe(nigarMesh, hostileUnits());
    if (state.enemy.hp <= 0) {
      state.nigarFree = true;
      moveToward(nigarMesh, playerMesh, 3.2, dt, 2.2);
    } else if (threat && dist(nigarMesh, threat.mesh) < 10) {
      moveAway(nigarMesh, threat.mesh, 3.6, dt);
    }

    function tickFoe(actor, mesh) {
      actor.demoralized = (actor.demoralized || 0) - dt;
      const friends = friendUnits();
      const near = friends.some((f) => dist(mesh, f.mesh) < 28);
      if (actor.hp <= 0 || state.episode < actor.ep) return;
      if (!near && actor.hp >= (actor.maxHp || actor.hp)) return;
      thinkEnemy(dt, actor, friends, actor.demoralized > 0);
    }
    tickFoe(state.guards[0], guard1Mesh);
    tickFoe(state.guards[1], guard2Mesh);
    tickFoe(state.sergeant, sergeantMesh);
    tickFoe(state.enemy, enemyMesh);
    tickFoe(state.remnants[0], remnant1Mesh);
    tickFoe(state.remnants[1], remnant2Mesh);

    if (state.episode === 1 && state.guards[0].hp <= 0 && state.guards[1].hp <= 0) {
      state.episode = 2;
      setEnemyLabel();
      story.textContent =
        "Episode II: the tax riders fall. Ride Ayvaz. A road sergeant still hunts the north path — then the captain at Çamlıbel.";
      setChapter("Episode II — The road sergeant");
    }
    if (state.episode === 2 && state.sergeant.hp <= 0) {
      state.episode = 3;
      setEnemyLabel();
      story.textContent =
        "Episode III: the sergeant is down. The captain waits at the fortress. Free Nigar, then speak with the band.";
      setChapter("Episode III — The captain of Bolu Bey");
    }
    if (state.episode === 3 && state.enemy.hp <= 0) {
      state.episode = 4;
      setEnemyLabel();
      setChapter("Episode IV — Counsel of the band");
      story.textContent =
        "Nigar is free. Speak with her — then Ali Kishi, the elder, the ashik, Ayvaz, Deli Hasan. Your words shape the keep. Then last riders.";
    }
    if (state.episode === 5 && state.remnants[0].hp <= 0 && state.remnants[1].hp <= 0) {
      state.episode = 6;
      gate.material.color.set(0x3a6b2a);
      setEnemyLabel();
      setChapter("Episode VI — The gate of Çamlıbel");
      story.textContent = "The last riders fall. Ride the green gate. Let Çamlıbel be what you chose in counsel.";
    }

    if (dist(playerMesh, gate) < 4 && state.episode >= 6) {
      endGame(true);
    }
    if (state.player.hp <= 0) endGame(false);
    if (state.ally.hp < 0) state.ally.hp = 0;
    if (state.ayvaz.hp < 0) state.ayvaz.hp = 0;
    if (state.enemy.hp < 0) state.enemy.hp = 0;
    if (state.sergeant.hp < 0) state.sergeant.hp = 0;
    for (const g of state.guards) if (g.hp < 0) g.hp = 0;
    for (const r of state.remnants) if (r.hp < 0) r.hp = 0;
    guard1Mesh.visible = state.guards[0].hp > 0;
    guard2Mesh.visible = state.guards[1].hp > 0;
    sergeantMesh.visible = state.sergeant.hp > 0;
    enemyMesh.visible = state.enemy.hp > 0;
    remnant1Mesh.visible = state.episode >= 5 && state.remnants[0].hp > 0;
    remnant2Mesh.visible = state.episode >= 5 && state.remnants[1].hp > 0;
  }

  playerFill.style.width = `${Math.max(0, state.player.hp)}%`;
  allyFill.style.width = `${Math.max(0, (state.ally.hp / 80) * 100)}%`;
  let foePct = 0;
  if (state.episode <= 1) {
    foePct = ((Math.max(0, state.guards[0].hp) + Math.max(0, state.guards[1].hp)) / 100) * 100;
  } else if (state.episode === 2) foePct = (Math.max(0, state.sergeant.hp) / 80) * 100;
  else if (state.episode === 3) foePct = (Math.max(0, state.enemy.hp) / 120) * 100;
  else if (state.episode === 5) {
    const tot = state.remnants[0].maxHp + state.remnants[1].maxHp;
    foePct = ((Math.max(0, state.remnants[0].hp) + Math.max(0, state.remnants[1].hp)) / tot) * 100;
  } else foePct = state.episode >= 6 ? 0 : 100;
  enemyFill.style.width = `${Math.max(0, foePct)}%`;

  const clock = now * 0.001;
  gallop(playerMesh, clock);
  gallop(allyMesh, clock);
  gallop(enemyMesh, clock);
  gallop(guard1Mesh, clock);
  gallop(guard2Mesh, clock);
  gallop(sergeantMesh, clock);
  gallop(ayvazMesh, clock);
  gallop(remnant1Mesh, clock);
  gallop(remnant2Mesh, clock);

  drawMap();
  if (view3d.ok) {
    try {
      const p = playerMesh.position;
      view3d.camera.position.lerp(new THREE.Vector3(p.x, 12, p.z + 16), 0.08);
      view3d.camera.lookAt(p.x, 1.2, p.z);
      view3d.renderer.render(scene, view3d.camera);
    } catch {
      view3d.ok = false;
      map2d.classList.remove("minimap");
    }
  }
}

const view3d = { ok: false, renderer: null, camera: null };

function attachBillboard(group, art, y) {
  const mount = () => {
    if (!art.complete || !art.naturalWidth) return;
    const tex = new THREE.CanvasTexture(art);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    const spr = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: 0.15, depthWrite: false })
    );
    spr.scale.set(y > 1.4 ? 0.95 : 1.2, y > 1.4 ? 1.35 : 1.7, 1);
    spr.position.set(0.05, y, 0.15);
    group.add(spr);
  };
  if (art.complete && art.naturalWidth) mount();
  else {
    art._onreadies = art._onreadies || [];
    art._onreadies.push(mount);
  }
}

function startLowPoly3d() {
  try {
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x87a0b8, 1);
    renderer.setPixelRatio(1);
    const camera = new THREE.PerspectiveCamera(55, Math.max(innerWidth, 1) / Math.max(innerHeight, 1), 0.5, 200);
    camera.position.set(-6, 12, 30);
    const fit = () => {
      const w = Math.max(innerWidth, 1);
      const h = Math.max(innerHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, true);
    };
    fit();
    Object.assign(renderer.domElement.style, {
      position: "fixed",
      inset: "0",
      zIndex: "0",
      width: "100%",
      height: "100%",
    });
    document.body.prepend(renderer.domElement);
    attachBillboard(playerMesh, korogluArt, 1.72);
    attachBillboard(allyMesh, hasanArt, 1.72);
    attachBillboard(enemyMesh, captainArt, 1.72);
    attachBillboard(guard1Mesh, captainArt, 1.72);
    attachBillboard(guard2Mesh, captainArt, 1.72);
    attachBillboard(sergeantMesh, captainArt, 1.72);
    attachBillboard(ayvazMesh, ayvazArt, 1.72);
    attachBillboard(remnant1Mesh, captainArt, 1.72);
    attachBillboard(remnant2Mesh, captainArt, 1.72);
    attachBillboard(fatherMesh, fatherArt, 1.15);
    attachBillboard(nigarMesh, nigarArt, 1.15);
    attachBillboard(ashikMesh, ashikArt, 1.15);
    attachBillboard(elderMesh, elderArt, 1.15);
    view3d.ok = true;
    view3d.renderer = renderer;
    view3d.camera = camera;
    map2d.classList.add("minimap");
    window.addEventListener("resize", fit);
  } catch (err) {
    view3d.ok = false;
    console.warn("Low-poly 3D skipped:", err && err.message ? err.message : err);
  }
}

startLowPoly3d();

let introIndex = 0;
const introEl = document.getElementById("intro");
const introArt = document.getElementById("introArt");
const introText = document.getElementById("introText");
const introName = document.getElementById("introName");

const ART_BY_PATH = {
  "/characters/ali-kishi.jpg": fatherArt,
  "/characters/captain.jpg": captainArt,
  "/characters/koroglu.jpg": korogluArt,
  "/characters/deli-hasan.jpg": hasanArt,
  "/characters/nigar.jpg": nigarArt,
  "/characters/ayvaz.jpg": ayvazArt,
  "/characters/ashik.jpg": ashikArt,
  "/characters/elder.jpg": elderArt,
};

function paintIntro() {
  const slide = INTRO[introIndex];
  const keyed = ART_BY_PATH[slide.img];
  introArt.src = keyed && keyed._png ? keyed._png : slide.img;
  introName.textContent = slide.name;
  introText.textContent = slide.text;
}

function closeIntro() {
  state.intro = false;
  state.autoplay = true;
  state.autoT = 0;
  introEl.classList.add("hidden");
  story.textContent = OPENING;
  setChapter("Episode I — Tax riders of Bolu Bey");
  setEnemyLabel();
  state.player.hp = 68;
}

function nextIntro() {
  introIndex += 1;
  if (introIndex >= INTRO.length) closeIntro();
  else paintIntro();
}

window.__refreshIntro = paintIntro;
paintIntro();
document.getElementById("introNext").onclick = nextIntro;
document.getElementById("introSkip").onclick = closeIntro;
let introTick = 0;
setInterval(() => {
  if (!state.intro) return;
  introTick += 1;
  if (introTick % 3 === 0) nextIntro();
}, 1000);

window.addEventListener("resize", drawMap);
drawMap();
animate(performance.now());

if (new URLSearchParams(location.search).has("ending")) {
  closeIntro();
  endGame(true);
}
