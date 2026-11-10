import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js/+esm';

const root = document.querySelector('#scene');
const loading = document.querySelector('#loading');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050713, 0.0017);
const camera = new THREE.PerspectiveCamera(48, root.clientWidth / root.clientHeight, 0.1, 1800);
camera.position.set(0, 105, 185);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(root.clientWidth, root.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
root.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.045;
controls.minDistance = 35;
controls.maxDistance = 420;
controls.maxPolarAngle = Math.PI * .88;

scene.add(new THREE.AmbientLight(0x9aa9ff, 0.8));
const sunLight = new THREE.PointLight(0xffffff, 2600, 900, 1.7);
scene.add(sunLight);

const starGeo = new THREE.BufferGeometry();
const starPositions = [];
for(let i=0;i<2600;i++){
  const r=450*Math.random(), theta=Math.random()*Math.PI*2, phi=Math.acos(2*Math.random()-1);
  starPositions.push(r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta));
}
starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));
const stars = new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xbac7ff,size:1.05,transparent:true,opacity:.8}));
scene.add(stars);

const planetData = [
 {name:'Mercury',color:0x9b9289,size:1.5,orbit:13,speed:1.6,diameter:'4,879 km',day:'58.6 Earth days',moons:'0',type:'TERRESTRIAL PLANET',desc:'The smallest planet and the closest to the Sun. Its cratered surface is shaped by billions of years of impacts.',symbol:'☿'},
 {name:'Venus',color:0xe5b77c,size:2.5,orbit:20,speed:1.15,diameter:'12,104 km',day:'243 Earth days',moons:'0',type:'TERRESTRIAL PLANET',desc:'A world wrapped in thick clouds. Venus has an extremely hot surface and rotates in the opposite direction to most planets.',symbol:'♀'},
 {name:'Earth',color:0x398cff,size:2.7,orbit:29,speed:1,diameter:'12,742 km',day:'23 h 56 min',moons:'1',type:'TERRESTRIAL PLANET',desc:'Our home planet: the only world known to support life, with liquid water on its surface and a protective atmosphere.',symbol:'⊕'},
 {name:'Mars',color:0xc75d3e,size:2.1,orbit:39,speed:.8,diameter:'6,779 km',day:'24 h 37 min',moons:'2',type:'TERRESTRIAL PLANET',desc:'The Red Planet has giant volcanoes, ancient river valleys and two small moons. Robotic explorers study whether it once hosted life.',symbol:'♂'},
 {name:'Jupiter',color:0xd5ae83,size:8.3,orbit:61,speed:.43,diameter:'139,820 km',day:'9 h 56 min',moons:'95 confirmed',type:'GAS GIANT',desc:'The largest planet in our solar system. Its swirling cloud bands include the Great Red Spot, a storm larger than Earth.',symbol:'♃'},
 {name:'Saturn',color:0xd9c28d,size:7.1,orbit:87,speed:.32,diameter:'116,460 km',day:'10 h 33 min',moons:'146 confirmed',type:'GAS GIANT',desc:'Famous for its spectacular rings made of countless pieces of ice and rock. Saturn is so low in density it would float in water.',symbol:'♄'},
 {name:'Uranus',color:0x82d8df,size:4.5,orbit:112,speed:.23,diameter:'50,724 km',day:'17 h 14 min',moons:'28 confirmed',type:'ICE GIANT',desc:'An icy giant that spins almost on its side. Its blue-green colour comes from methane in the atmosphere.',symbol:'♅'},
 {name:'Neptune',color:0x4268e8,size:4.4,orbit:137,speed:.18,diameter:'49,244 km',day:'16 h 6 min',moons:'16 confirmed',type:'ICE GIANT',desc:'A distant, deep-blue ice giant with supersonic winds. It takes about 165 Earth years to orbit the Sun.',symbol:'♆'}
];

const sun = new THREE.Mesh(new THREE.SphereGeometry(5.8,48,48),new THREE.MeshBasicMaterial({color:0xffc45c}));
scene.add(sun);
const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({map:createGlow(),color:0xffa52f,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
sunGlow.scale.set(32,32,1); sun.add(sunGlow);

function createGlow(){
 const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');
 const g=ctx.createRadialGradient(64,64,2,64,64,64);g.addColorStop(0,'rgba(255,220,120,1)');g.addColorStop(.22,'rgba(255,160,45,.45)');g.addColorStop(1,'rgba(255,130,20,0)');
 ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);
}
const planetMeshes=[];
planetData.forEach((p,i)=>{
 const orbitGeo=new THREE.BufferGeometry();const pts=[];
 for(let j=0;j<=240;j++){const a=j/240*Math.PI*2;pts.push(Math.cos(a)*p.orbit,0,Math.sin(a)*p.orbit)}
 orbitGeo.setFromPoints(pts);
 const orbit=new THREE.LineLoop(orbitGeo,new THREE.LineBasicMaterial({color:0x6977a6,transparent:true,opacity:.24}));
 scene.add(orbit);
 const material=new THREE.MeshStandardMaterial({color:p.color,roughness:.78,metalness:.02});
 const mesh=new THREE.Mesh(new THREE.SphereGeometry(p.size,36,36),material);
 mesh.userData.index=i;scene.add(mesh);
 if(p.name==='Saturn'){
   const ring=new THREE.Mesh(new THREE.RingGeometry(p.size*1.25,p.size*1.9,80),new THREE.MeshBasicMaterial({color:0xc9b58c,side:THREE.DoubleSide,transparent:true,opacity:.72}));
   ring.rotation.x=-Math.PI/2.35;mesh.add(ring);
 }
 if(p.name==='Earth'){
   const cloud=new THREE.Mesh(new THREE.SphereGeometry(p.size*1.018,32,32),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.10,wireframe:true}));mesh.add(cloud);
 }
 planetMeshes.push(mesh);
});
const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
let selected=-1, paused=false, speed=1, elapsed=0;
const buttons=document.querySelector('#planetButtons');
planetData.forEach((p,i)=>{
 const b=document.createElement('button');b.className='planet-btn';b.innerHTML=`<span class="dot" style="background:#${p.color.toString(16).padStart(6,'0')}"></span>${p.name}`;
 b.addEventListener('click',()=>selectPlanet(i,true));buttons.appendChild(b);
});
function selectPlanet(i,focus=false){
 selected=i;
 [...buttons.children].forEach((b,j)=>b.classList.toggle('active',j===i));
 const p=planetData[i];
 document.querySelector('#planetSymbol').textContent=p.symbol;
 document.querySelector('#planetName').textContent=p.name;
 document.querySelector('#planetType').textContent=p.type;
 document.querySelector('#planetDesc').textContent=p.desc;
 document.querySelector('#planetDiameter').textContent=p.diameter;
 document.querySelector('#planetDay').textContent=p.day;
 document.querySelector('#planetMoons').textContent=p.moons;
 if(focus){
  const m=planetMeshes[i], target=m.position.clone();
  controls.target.copy(target);
  camera.position.copy(target.clone().add(new THREE.Vector3(0,p.size*3.5,p.size*7+13)));
  controls.update();
 }
}
selectPlanet(2);
const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);
 const delta=Math.min(clock.getDelta(),.05);
 if(!paused){
  elapsed+=delta*speed;
  planetMeshes.forEach((m,i)=>{
   const p=planetData[i], a=elapsed*p.speed*.22+i*.7;
   m.position.set(Math.cos(a)*p.orbit,Math.sin(a*1.7)*.55,Math.sin(a)*p.orbit);
   m.rotation.y+=delta*.35;
  });
  sun.rotation.y+=delta*.08;
  stars.rotation.y+=delta*.002;
 }
 controls.update();renderer.render(scene,camera);
}
animate();
root.addEventListener('pointerdown',e=>{
 const rect=root.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
 raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(planetMeshes);
 if(hits.length)selectPlanet(hits[0].object.userData.index,true);
});
document.querySelector('#pauseBtn').addEventListener('click',e=>{paused=!paused;e.currentTarget.innerHTML=paused?'▶ &nbsp; RESUME':'Ⅱ &nbsp; PAUSE'});
document.querySelector('#resetBtn').addEventListener('click',()=>{camera.position.set(0,105,185);controls.target.set(0,0,0);controls.update();selectPlanet(2)});
document.querySelector('#speed').addEventListener('input',e=>{speed=Number(e.target.value);document.querySelector('#speedValue').textContent=speed.toFixed(1)+'×'});
function resize(){const w=root.clientWidth,h=root.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}
new ResizeObserver(resize).observe(root);
loading.classList.add('done');setTimeout(()=>loading.remove(),600);
