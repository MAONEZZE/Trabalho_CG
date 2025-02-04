import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

import Carro from '../models/carro.js';
import Pista from '../models/pista.js';
import Chao from '../models/chao.js';
import Ceu from '../models/ceu.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const luzFocal = new THREE.PointLight('#ffe9d3', 0.9); 
luzFocal.position.x = 250;
luzFocal.position.y = 90;
luzFocal.position.z = 0;
scene.add(luzFocal);

const luzAmbiente = new THREE.AmbientLight('#afafaf', 0.8); 
scene.add(luzAmbiente);

const pista = new Pista();
const [pistaMontada, curve, pilares] = pista.MontagemPista();
scene.add(pistaMontada);

const carro = new Carro();
const carroMontado = carro.MontagemCarro();
scene.add(carroMontado);

const chao = new Chao(pilares);
const chaoFormado = chao.CriarChao();
scene.add(chaoFormado);

const ceu = new Ceu();
const ceuMontado = ceu.MontarCeu();
scene.add(ceuMontado);

let carProgress = 0;

// Controle da câmera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suavidade no movimento
controls.enablePan = true; // Permite o movimento horizontal/vertical da câmera
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,  // Botão esquerdo do mouse para rotacionar
  MIDDLE: THREE.MOUSE.DOLLY, // Roda do meio para zoom
  RIGHT: THREE.MOUSE.PAN     // Botão direito para movimentar
};

// Camera Inicial
camera.position.set(10, 10, 30);

function AtualizandoPosicaoCarro() {
  // Pega a posição do carrinho na curva
  const posicaoCarro = curve.getPointAt(carProgress);
  const tangente = curve.getTangentAt(carProgress);

  // rotaciona o carrinho de a cordo com a curva
  const normal = new THREE.Vector3(0, 1, 0); 
  const binormal = new THREE.Vector3(); 
  binormal.crossVectors(tangente, normal).normalize(); 
  normal.crossVectors(binormal, tangente).normalize(); 

  const matrix = new THREE.Matrix4();
  matrix.makeBasis(tangente, normal, binormal);
  carroMontado.setRotationFromMatrix(matrix); 

  // sobe o carrinho pra não ficar no chão
  carroMontado.position.copy(posicaoCarro);
  carroMontado.position.add(normal.multiplyScalar(0.4)); 

  carProgress += 0.001;
  if (carProgress > 1) {
    carProgress = 0; 
  }
}

// Função de animação
function animate() {
  requestAnimationFrame(animate);

  // Atualizar posição e orientação do carrinho
  AtualizandoPosicaoCarro();

  // Atualizar controles da câmera
  controls.update();

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