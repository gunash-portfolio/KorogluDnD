import * as THREE from "three";

const VERSES = [
  "I am Koroglu — son of the blinded man!",
  "A brave heart does not steal from the poor!",
  "Justice is a sword that will not rust!",
];

const OPENING =
  "Bolu Bey blinded your father for telling the truth. Ride close to the people of the valley. Hear them. Then fight for justice, not glory.";

const keys = new Set();
window.addEventListener("keydown", (e) => {
  keys.add(e.key.toLowerCase());
  if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});
window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87a0b8);
scene.fog = new THREE.Fog(0x87a0b8, 40, 120);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.prepend(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffe8c8, 0.55));
const sun = new THREE.DirectionalLight(0xfff0d0, 1.15);
sun.position.set(30, 40, 10);
sun.castShadow = true;
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(160, 160, 24, 24),
  new THREE.MeshStandardMaterial({ color: 0x4d6b3a, roughness: 0.95 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
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
    new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
  );
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
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

function makeRider(bodyColor, sashColor, horseColor = 0x3b2416) {
  const g = new THREE.Group();
  const horse = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.8, 0.7),
    new THREE.MeshStandardMaterial({ color: horseColor })
  );
  horse.position.y = 0.7;
  horse.castShadow = true;
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.35, 0.35),
    new THREE.MeshStandardMaterial({ color: horseColor })
  );
  head.position.set(0.95, 1.05, 0);
  const rider = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.22, 0.55, 4, 8),
    new THREE.MeshStandardMaterial({ color: bodyColor })
  );
  rider.position.y = 1.55;
  const sash = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.12, 0.45),
    new THREE.MeshStandardMaterial({ color: sashColor })
  );
  sash.position.y = 1.35;
  g.add(horse, head, rider, sash);
  scene.add(g);
  return g;
}

function makeWalker(bodyColor, sashColor) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.28, 0.7, 4, 8),
    new THREE.MeshStandardMaterial({ color: bodyColor })
  );
  body.position.y = 1.05;
  body.castShadow = true;
  const sash = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.12, 0.4),
    new THREE.MeshStandardMaterial({ color: sashColor })
  );
  sash.position.y = 1.05;
  g.add(body, sash);
  scene.add(g);
  return g;
}

const playerMesh = makeRider(0xc9a227, 0x8b1e1e, 0x1a1a1a);
playerMesh.position.set(-6, 0, 14);
const allyMesh = makeRider(0x3d6b4f, 0xd4c48a);
allyMesh.position.set(-9, 0, 16);
const enemyMesh = makeRider(0x6b1c1c, 0x222);
enemyMesh.position.set(4, 0, -8);
const ayvazMesh = makeRider(0x4a6fa5, 0xe8d9a0, 0x5a3a22);
ayvazMesh.position.set(12, 0, 16);

const fatherMesh = makeWalker(0x8a7a62, 0x4a3a28);
fatherMesh.position.set(-14, 0, 18);
const nigarMesh = makeWalker(0xc4788a, 0xf0e0b0);
nigarMesh.position.set(-3, 0, -16);
const ashikMesh = makeWalker(0x5c3d8a, 0xc9a227);
ashikMesh.position.set(8, 0, 20);
const elderMesh = makeWalker(0x6a5a48, 0xb08a4a);
elderMesh.position.set(-18, 0, 8);

const nametagRoot = document.getElementById("nametags");
const labeled = [
  { mesh: playerMesh, name: "Koroglu", y: 2.6 },
  { mesh: allyMesh, name: "Deli Hasan", y: 2.6 },
  { mesh: enemyMesh, name: "Captain of Bolu Bey", y: 2.6 },
  { mesh: ayvazMesh, name: "Ayvaz", y: 2.6 },
  { mesh: fatherMesh, name: "Ali Kishi (father)", y: 2.2 },
  { mesh: nigarMesh, name: "Nigar", y: 2.2 },
  { mesh: ashikMesh, name: "The ashik", y: 2.2 },
  { mesh: elderMesh, name: "Village elder", y: 2.2 },
].map((item) => {
  const el = document.createElement("div");
  el.className = "nametag";
  el.textContent = item.name;
  nametagRoot.appendChild(el);
  return { ...item, el };
});

const speakers = [
  {
    id: "father",
    mesh: fatherMesh,
    line: "Ali Kishi: They took my eyes because I would not lie. Son — be brave, but be good. A tyrant fears a just man more than a strong one.",
  },
  {
    id: "elder",
    mesh: elderMesh,
    line: "Elder: Justice is not revenge. Protect the weak of this valley. If you ride only for anger, you become Bolu Bey.",
  },
  {
    id: "ashik",
    mesh: ashikMesh,
    line: "Ashik: Sing of bravery so the people remember. A verse that defends the poor cuts deeper than steel.",
  },
  {
    id: "ayvaz",
    mesh: ayvazMesh,
    line: "Ayvaz: I will ride with you, Koroglu. Not for fame — because the hungry should eat, and the cruel should answer.",
  },
  {
    id: "nigar",
    mesh: nigarMesh,
    line: "Nigar: Do not become the thing you hate. Free me, then free this land. Kindness is also courage.",
  },
];

const sword = new THREE.Mesh(
  new THREE.BoxGeometry(0.12, 0.12, 1.3),
  new THREE.MeshStandardMaterial({ color: 0xc0c8d0, metalness: 0.7, roughness: 0.3 })
);
sword.position.set(0.45, 1.45, 0.55);
playerMesh.add(sword);

let state = createState();

function createState() {
  return {
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
    player: { hp: 100, speed: 8, yaw: 0 },
    ally: { hp: 80, attackCd: 0 },
    ayvaz: { hp: 70, attackCd: 0 },
    enemy: { hp: 120, attackCd: 0, demoralized: 0, speed: 5.2 },
  };
}

const playerFill = document.getElementById("playerFill");
const allyFill = document.getElementById("allyFill");
const enemyFill = document.getElementById("enemyFill");
const banner = document.getElementById("banner");
const bannerTitle = document.getElementById("bannerTitle");
const bannerText = document.getElementById("bannerText");
const story = document.getElementById("story");

document.getElementById("restart").onclick = () => {
  state = createState();
  playerMesh.position.set(-6, 0, 14);
  allyMesh.position.set(-9, 0, 16);
  enemyMesh.position.set(4, 0, -8);
  ayvazMesh.position.set(12, 0, 16);
  nigarMesh.position.set(-3, 0, -16);
  banner.classList.remove("show");
  story.textContent = OPENING;
  gate.material.color.set(0x2a1c12);
};

function endGame(win) {
  state.over = true;
  state.win = win;
  banner.classList.add("show");
  if (win) {
    bannerTitle.textContent = "Justice rides at Çamlıbel";
    bannerText.textContent =
      "The captain falls. Nigar is free. You did not fight for pride — you fought so the weak could live without fear. The rebellion begins in goodness.";
  } else {
    bannerTitle.textContent = "The ride ends";
    bannerText.textContent = "Courage without care is not enough. Rise again. Be brave, and be just.";
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

const tagPos = new THREE.Vector3();
let last = performance.now();
let pointerDown = false;
renderer.domElement.addEventListener("pointerdown", () => {
  pointerDown = true;
});

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (!state.over) {
    let mx = 0;
    let mz = 0;
    if (keys.has("w") || keys.has("arrowup")) mz -= 1;
    if (keys.has("s") || keys.has("arrowdown")) mz += 1;
    if (keys.has("a") || keys.has("arrowleft")) mx -= 1;
    if (keys.has("d") || keys.has("arrowright")) mx += 1;
    if (mx || mz) {
      const len = Math.hypot(mx, mz);
      mx /= len;
      mz /= len;
      playerMesh.position.x += mx * state.player.speed * dt;
      playerMesh.position.z += mz * state.player.speed * dt;
      state.player.yaw = Math.atan2(mx, mz);
      playerMesh.rotation.y = state.player.yaw;
    }
    playerMesh.position.x = THREE.MathUtils.clamp(playerMesh.position.x, -55, 55);
    playerMesh.position.z = THREE.MathUtils.clamp(playerMesh.position.z, -55, 55);

    const justice = Boolean(state.heard.father && state.heard.elder);
    const swordDmg = justice ? 28 : 22;

    const swinging = keys.has(" ") || pointerDown;
    pointerDown = false;
    if (swinging && state.swordT <= 0) {
      state.swordT = 0.28;
      state.swordHit = false;
    }
    if (state.swordT > 0) {
      state.swordT -= dt;
      sword.rotation.y = Math.sin((0.28 - state.swordT) * 12) * 1.1;
      if (!state.swordHit && dist(playerMesh, enemyMesh) < 2.5) {
        state.enemy.hp -= swordDmg;
        state.swordHit = true;
      }
    } else {
      sword.rotation.y = 0;
    }

    state.verseCooldown -= dt;
    if (keys.has("p") && state.verseCooldown <= 0) {
      state.verseCooldown = 3.5;
      state.enemy.demoralized = 2.8;
      const line = VERSES[state.verseIndex % VERSES.length];
      state.verseIndex += 1;
      story.textContent = `Poetry combat: “${line}”  — the guard’s spirit wavers.`;
    }

    state.lastTalk -= dt;
    if (state.lastTalk <= 0) {
      for (const s of speakers) {
        if (dist(playerMesh, s.mesh) < 3.2) {
          story.textContent = s.line;
          state.heard[s.id] = true;
          state.lastTalk = 2.4;
          if (s.id === "ayvaz") state.ayvazJoined = true;
          if (s.id === "nigar" && state.enemy.hp <= 0) state.nigarFree = true;
          if (s.id === "father" && !state.heard.fatherBless) {
            state.heard.fatherBless = true;
            state.player.hp = Math.min(100, state.player.hp + 12);
          }
          break;
        }
      }
    }

    moveToward(allyMesh, enemyMesh, 6.2, dt, 1.8);
    state.ally.attackCd -= dt;
    if (dist(allyMesh, enemyMesh) < 2.2 && state.ally.attackCd <= 0 && state.ally.hp > 0) {
      state.enemy.hp -= 9;
      state.ally.attackCd = 0.9;
    }

    if (state.ayvazJoined) {
      moveToward(ayvazMesh, enemyMesh, 5.8, dt, 2.0);
      state.ayvaz.attackCd -= dt;
      if (dist(ayvazMesh, enemyMesh) < 2.3 && state.ayvaz.attackCd <= 0) {
        state.enemy.hp -= 7;
        state.ayvaz.attackCd = 1.0;
      }
    }

    const enemySpeed = state.enemy.demoralized > 0 ? 2.2 : state.enemy.speed;
    state.enemy.demoralized -= dt;
    const target = state.ally.hp > 0 && dist(enemyMesh, allyMesh) < dist(enemyMesh, playerMesh)
      ? allyMesh
      : playerMesh;
    moveToward(enemyMesh, target, enemySpeed, dt, 1.7);
    state.enemy.attackCd -= dt;
    if (dist(enemyMesh, target) < 2.0 && state.enemy.attackCd <= 0) {
      if (target === playerMesh) state.player.hp -= 12;
      else state.ally.hp -= 14;
      state.enemy.attackCd = 0.85;
    }

    if (dist(playerMesh, gate) < 4 && state.enemy.hp <= 0) {
      endGame(true);
    }
    if (state.enemy.hp <= 0 && !state.over) {
      if (state.nigarFree) {
        story.textContent = "Nigar is free. Ride through the gate — let Çamlıbel be a home for the just.";
      } else {
        story.textContent = "The captain is down. Go to Nigar, then ride through the fortress gate.";
      }
      gate.material.color.set(0x3a6b2a);
    }
    if (state.player.hp <= 0) endGame(false);
    if (state.ally.hp < 0) state.ally.hp = 0;
    if (state.enemy.hp < 0) state.enemy.hp = 0;
  }

  playerFill.style.width = `${Math.max(0, state.player.hp)}%`;
  allyFill.style.width = `${Math.max(0, (state.ally.hp / 80) * 100)}%`;
  enemyFill.style.width = `${Math.max(0, (state.enemy.hp / 120) * 100)}%`;

  const camTarget = playerMesh.position.clone();
  camera.position.lerp(new THREE.Vector3(camTarget.x, 14, camTarget.z + 16), 0.08);
  camera.lookAt(camTarget.x, 1.2, camTarget.z);

  const tmp = new THREE.Vector3();
  for (const tag of labeled) {
    tmp.copy(tag.mesh.position);
    tmp.y += tag.y;
    tmp.project(camera);
    const x = (tmp.x * 0.5 + 0.5) * innerWidth;
    const y = (-tmp.y * 0.5 + 0.5) * innerHeight;
    tag.el.style.left = `${x}px`;
    tag.el.style.top = `${y}px`;
    tag.el.style.display = tmp.z > 1 ? "none" : "block";
  }

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

animate(performance.now());
