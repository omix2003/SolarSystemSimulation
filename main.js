import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {planetFacts} from "./planetFacts.js"
import gsap from "gsap";
import starsTexture from './src/img/stars.jpg';
import sunTexture from './src/img/sun.jpg';
import mercuryTexture from './src/img/mercury.jpg';
import venusTexture from './src/img/venus.jpg';
import earthTexture from './src/img/earth.jpg';
import marsTexture from './src/img/mars.jpg';
import jupiterTexture from './src/img/jupiter.jpg';
import saturnTexture from './src/img/saturn.jpg';
import saturnRingTexture from './src/img/saturn ring.png';
import uranusTexture from './src/img/uranus.jpg';
import uranusRingTexture from './src/img/uranus ring.png';
import neptuneTexture from './src/img/neptune.jpg';
import plutoTexture from './src/img/pluto.jpg';
import { AmbientLight, Material } from 'three';

//setting up orbit control

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('planetTooltip');


const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//creating a scene to add all elements

const scene = new THREE.Scene();

//creating a camera instance
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,1000
);

//setting up texture loader

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([

  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture
]);

//setting up orbit control

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

//seting up light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//loading planets
const textureload = new THREE.TextureLoader();
//sun
const sunGeo = new THREE.SphereGeometry(12, 25, 20);
const sunMat = new THREE.MeshBasicMaterial({

  map:textureload.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

//adding point light
const pointLight = new THREE.PointLight(0xffffff , 3 , 300);
scene.add(pointLight);

//loading another planets now
//using function
 
function createPlanet(size, texture,position, ring){
    const geometry = new THREE.SphereGeometry(size, 25, 20);
    const material = new THREE.MeshStandardMaterial({
      map:textureload.load(texture)
    });
    const planet = new THREE.Mesh(geometry, material);
    const planetObj = new THREE.Object3D;
    planetObj.add(planet);
    scene.add(planetObj);
    planet.position.x = position;

    if(ring)
{
  const RingGeo = new THREE.RingGeometry(
    ring.innerRadius,
    ring.outerRadius, 30
  );
  const RingMat = new THREE.MeshStandardMaterial({
    map:textureload.load(ring.texture),
    side : THREE.DoubleSide
  });
  const Ring = new THREE.Mesh(RingGeo, RingMat);
  planetObj.add(Ring);

  Ring.position.x = position;
  Ring.rotation.x = -0.5 *Math.PI;
}
return {planet, planetObj};
}

const mercury = new createPlanet(4,mercuryTexture,20);
const venus = new createPlanet(5,venusTexture,40);
const earth = new createPlanet(5.56,earthTexture,60);
const mars = new createPlanet(5,marsTexture,80);
const jupiter = new createPlanet(6,jupiterTexture,100);
const saturn = new createPlanet(8,saturnTexture,150,{
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture
});
const uranus = new createPlanet(8.2,uranusTexture,200,{
  innerRadius: 10,
  outerRadius: 20,
  texture: uranusRingTexture
});
const neptune = new createPlanet(5,neptuneTexture,240);

const planets = {
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune
};


const planetSpeeds = {
  mercury: 0.02,
  venus: 0.015,
  earth: 0.01,
  mars: 0.008,
  jupiter: 0.004,
  saturn: 0.003,
  uranus: 0.002,
  neptune: 0.001
};

function animate() {
  if (!isPaused) {
    sun.rotateY(0.002 * timeScale);

    mercury.planet.rotateY(0.001 * timeScale);
    mercury.planetObj.rotateY(planetSpeeds.mercury * timeScale);

    venus.planet.rotateY(0.0012 * timeScale);
    venus.planetObj.rotateY(planetSpeeds.venus * timeScale);

    earth.planet.rotateY(0.012 * timeScale);
    earth.planetObj.rotateY(planetSpeeds.earth * timeScale);

    mars.planet.rotateY(0.013 * timeScale);
    mars.planetObj.rotateY(planetSpeeds.mars * timeScale);

    jupiter.planet.rotateY(0.04 * timeScale);
    jupiter.planetObj.rotateY(planetSpeeds.jupiter * timeScale);

    saturn.planet.rotateY(0.01 * timeScale);
    saturn.planetObj.rotateY(planetSpeeds.saturn * timeScale);

    uranus.planet.rotateY(0.01 * timeScale);
    uranus.planetObj.rotateY(planetSpeeds.uranus * timeScale);

    neptune.planet.rotateY(0.01 * timeScale);
    neptune.planetObj.rotateY(planetSpeeds.neptune * timeScale);
  }

  // 🧠 Maintain focus on the current planet
  if (currentFocusedPlanet) {
    const focusTarget = currentFocusedPlanet.getWorldPosition(new THREE.Vector3());
    camera.lookAt(focusTarget);
  }

  renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);
function setupSpeedControls() {
  for (const planet in planetSpeeds) {
    const slider = document.getElementById(`${planet}Slider`);
    slider.addEventListener('input', (e) => {
      planetSpeeds[planet] = parseFloat(e.target.value);
    });
  }
}
setupSpeedControls();
let timeScale = 1; // default 1x speed
let isPaused= false;
let currentFocusedPlanet = null;

document.getElementById('timeSpeed').addEventListener('input', (e) => {
  timeScale = parseFloat(e.target.value);
  document.getElementById('timeSpeedValue').textContent = `${timeScale.toFixed(1)}x`;
});
const pauseResumeBtn = document.getElementById('pauseResumeBtn');
pauseResumeBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseResumeBtn.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
});
let isDay = false;

const themeToggleBtn = document.getElementById('themeToggleBtn');
themeToggleBtn.addEventListener('click', () => {
  isDay = !isDay;

  // 🌞 Day mode
  if (isDay) {
    ambientLight.intensity = 1;
    pointLight.intensity = 2.5;
    document.body.style.backgroundColor = "#f0f0f0";
    document.getElementById('controls').style.background = "rgba(255, 255, 255, 0.7)";
    document.getElementById('controls').style.color = "#000";
    themeToggleBtn.textContent = "🌑 Night Mode";
  }
  // 🌙 Night mode
  else {
    ambientLight.intensity = 0.3;
    pointLight.intensity = 3;
    document.body.style.backgroundColor = "#000000";
    document.getElementById('controls').style.background = "rgba(0, 0, 0, 0.6)";
    document.getElementById('controls').style.color = "#fff";
    themeToggleBtn.textContent = "🌞 Day Mode";
  }
});

window.addEventListener('click', (event) => {
  // Normalize mouse coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const clickableMeshes = Object.values(planets).map(p => p.planet);
  const intersects = raycaster.intersectObjects(clickableMeshes);

  if (intersects.length > 0) {
    const clickedPlanet = intersects[0].object;
    currentFocusedPlanet = clickedPlanet;

    const targetPos = clickedPlanet.getWorldPosition(new THREE.Vector3());
    const scaleFactor = clickedPlanet.scale.x || 1;
    const offset = new THREE.Vector3(20, 10, 20).multiplyScalar(scaleFactor);
    const newCamPos = targetPos.clone().add(offset);

    // Animate camera
    gsap.to(camera.position, {
      x: newCamPos.x,
      y: newCamPos.y,
      z: newCamPos.z,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => camera.lookAt(targetPos)
    });

    // 🌍 Show fact sheet
    const planetName = Object.entries(planets).find(([key, val]) => val.planet === clickedPlanet)?.[0];

    if (planetName && planetFacts[planetName]) {
      const fact = planetFacts[planetName];

      document.getElementById('factTitle').textContent = fact.name;
      document.getElementById('factDiameter').textContent = fact.diameter;
      document.getElementById('factDistance').textContent = fact.distance;
      document.getElementById('factOrbit').textContent = fact.orbitPeriod;
      document.getElementById('factDescription').textContent = fact.description;

      document.getElementById('factSheet').style.right = '0px';
    }
  }
});
const closeBtn = document.getElementById('closeFactBtn');
const factSheet = document.getElementById('factSheet');

if (closeBtn && factSheet) {
  closeBtn.addEventListener('click', () => {
    factSheet.style.right = '-400px';
  });
}


const resetViewBtn = document.getElementById('resetViewBtn');
resetViewBtn.addEventListener('click', () => {
  currentFocusedPlanet = null; // 🧠 Clear camera focus

  const sunPos = sun.getWorldPosition(new THREE.Vector3());

  gsap.to(camera.position, {
    x: -90,
    y: 140,
    z: 140,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      camera.lookAt(sunPos);
    }
  });
  
});

window.addEventListener('mousemove', (event) => {
  // Update mouse coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const clickableMeshes = Object.values(planets).map(p => p.planet);
  const intersects = raycaster.intersectObjects(clickableMeshes);

  if (intersects.length > 0) {
    const hoveredPlanet = intersects[0].object;
    const planetName = Object.entries(planets).find(([key, val]) => val.planet === hoveredPlanet)?.[0];

    if (planetName) {
      tooltip.textContent = planetName.charAt(0).toUpperCase() + planetName.slice(1);
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY}px`;
      tooltip.style.display = 'block';
    }
  } else {
    tooltip.style.display = 'none';
  }
});
// 🌌 Toggle Speed Panel
const toggleSpeedPanelBtn = document.getElementById('toggleSpeedPanelBtn');
const speedPanel = document.getElementById('planetSpeedPanel');

toggleSpeedPanelBtn.addEventListener('click', () => {
  const isVisible = speedPanel.style.display === 'block';
  speedPanel.style.display = isVisible ? 'none' : 'block';
});



//setting window size

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
});


