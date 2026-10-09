import * as THREE from "three";

const VERSES = [
  "I am Koroglu — son of the blinded man!",
  "Çamlıbel will not kneel to Bolu Bey!",
  "My saz is a sword; my verse is fire!",
];

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

function makeRider(bodyColor, sashColor) {
  const g = new THREE.Group();
  const horse = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.8, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x3b2416 })
  );
  horse.position.y = 0.7;
  horse.castShadow = true;
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.35, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x3b2416 })
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

const playerMesh = makeRider(0xc9a227, 0x8b1e1e);
playerMesh.position.set(-6, 0, 10);
const allyMesh = makeRider(0x3d6b4f, 0xd4c48a);
allyMesh.position.set(-9, 0, 12);
const enemyMesh = makeRider(0x6b1c1c, 0x222);
enemyMesh.position.set(4, 0, -8);

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
    player: { hp: 100, speed: 8, yaw: 0 },
    ally: { hp: 80, attackCd: 0 },
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
  playerMesh.position.set(-6, 0, 10);
  allyMesh.position.set(-9, 0, 12);
  enemyMesh.position.set(4, 0, -8);
  banner.classList.remove("show");
  story.textContent = "Your father was blinded by Bolu Bey. Ride with your ally. Rescue Nigar. Take Çamlıbel.";
};

function endGame(win) {
  state.over = true;
  state.win = win;
  banner.classList.add("show");
  if (win) {
    bannerTitle.textContent = "Çamlıbel is yours";
    bannerText.textContent = "The guard falls. Nigar is free. The fortress gate opens — the rebellion begins.";
  } else {
    bannerTitle.textContent = "The ride ends";
    bannerText.textContent = "Bolu Bey’s men hold the field. Rise again, Koroglu.";
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
        state.enemy.hp -= 22;
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

    moveToward(allyMesh, enemyMesh, 6.2, dt, 1.8);
    state.ally.attackCd -= dt;
    if (dist(allyMesh, enemyMesh) < 2.2 && state.ally.attackCd <= 0 && state.ally.hp > 0) {
      state.enemy.hp -= 9;
      state.ally.attackCd = 0.9;
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
      story.textContent = "The guard is down. Ride through the fortress gate.";
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

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

animate(performance.now());
