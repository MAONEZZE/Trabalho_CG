import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

// Configuração inicial da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Iluminação
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Luz ambiente
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Luz direcional
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Criação do veículo (representado como um cubo)
const formatoDoVeiculo = new THREE.BoxGeometry(1, 1, 1); // X, Y, Z
const propriedadesDoVeiculo = new THREE.MeshStandardMaterial({ color: '#BDB76B' });
const carro = new THREE.Mesh(formatoDoVeiculo, propriedadesDoVeiculo);
scene.add(carro);

// Caminho da pista (curva contínua com subidas, descidas e curvas)
const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(10, 5, 0),
  new THREE.Vector3(20, 0, 10),
  new THREE.Vector3(30, -5, 0),
  new THREE.Vector3(40, 0, -10),
  new THREE.Vector3(30, 5, -20),
  new THREE.Vector3(10, 10, -10),
  new THREE.Vector3(-5, 0, -10) // Fechar o circuito
]);

// Geometria e material da pista
const formatoDoCaminho = new THREE.TubeGeometry(
  curve,
  1000,
  0.7,
  2,
  true
);

const propriedadesDoCaminho = new THREE.MeshStandardMaterial({
  color: 0xff4500,
  emissive: 0x550000,
  metalness: 0.5,
  roughness: 0.1
});

// Criar a pista
const pista = new THREE.Mesh(formatoDoCaminho, propriedadesDoCaminho);
scene.add(pista);

// Ajustar a posição da câmera para garantir visibilidade
camera.position.set(0, 10, 30);
camera.lookAt(0, 0, 0);

// Variável de progresso do carro na pista
let progress = 0;

// Controle da câmera (Agora usando a forma correta de instanciar)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suavidade no movimento
controls.enablePan = true; // Permite o movimento horizontal/vertical da câmera
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,  // Botão esquerdo do mouse para rotacionar
  MIDDLE: THREE.MOUSE.DOLLY, // Roda do meio para zoom
  RIGHT: THREE.MOUSE.PAN     // Botão direito para movimentar
};

// Animação da cena
function animate() {
  requestAnimationFrame(animate);

  // Atualizar a posição do veículo na curva
  const position = curve.getPointAt(progress % 1);
  const tangent = curve.getTangentAt(progress % 1);
  carro.position.copy(position);
  carro.rotation.y = Math.atan2(tangent.x, tangent.z);

  // Incrementar progresso
  progress += 0.001;

  // Atualizar controles da câmera
  controls.update(); // Atualiza a posição/visão da câmera com base no controle de órbita

  // Renderizar a cena
  renderer.render(scene, camera);
}

// Ajustar o tamanho do renderizador ao redimensionar a janela
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();