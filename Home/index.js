import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

import Carro from '../models/carro.js';
import Pista from '../models/pista.js';
import Chao from '../models/chao.js';
import Ceu from '../models/ceu.js';

// Configuração inicial da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Iluminação
const luzFocal = new THREE.PointLight('#ffe9d3', 0.9); 
luzFocal.position.x = 250;
luzFocal.position.y = 90;
luzFocal.position.z = 0;
scene.add(luzFocal);

const luzAmbiente = new THREE.AmbientLight('#afafaf', 0.8); // Luz ambiente
scene.add(luzAmbiente);

// const luzDirecional = new THREE.DirectionalLight('#ffffff', 0.1); // Luz direcional
// luzDirecional.position.set(5, 10, 7.5);
// scene.add(luzDirecional);

// Caminho da pista (curva contínua com subidas, descidas e curvas)
const pista = new Pista();
const [pistaMontada, curve, pilares] = pista.MontagemPista();
scene.add(pistaMontada);

// Grupo do carro
const carro = new Carro();
const carroMontado = carro.MontagemCarro();
scene.add(carroMontado);

// Formação do chão
const chao = new Chao(pilares);
const chaoFormado = chao.CriarChao();
scene.add(chaoFormado);

// Criando Céu
const ceu = new Ceu();
const ceuMontado = ceu.MontarCeu();
scene.add(ceuMontado);

// Variável de progresso do carrinho na pista
let carProgress = 0;

// Função para atualizar a posição e orientação do carrinho
function AtualizandoPosicaoCarro() {
  // Obtém a posição do carrinho na curva
  const posicaoCarro = curve.getPointAt(carProgress);

  // Obtém o vetor tangente na curva para a orientação
  const tangent = curve.getTangentAt(carProgress);

  // Define a rotação para alinhar o carrinho à curva
  const normal = new THREE.Vector3(0, 1, 0); // Vetor normal "para cima"
  const binormal = new THREE.Vector3(); // Binormal da curva
  binormal.crossVectors(tangent, normal).normalize(); // Calcula a binormal
  normal.crossVectors(binormal, tangent).normalize(); // Ajusta a normal

  const matrix = new THREE.Matrix4();
  matrix.makeBasis(tangent, normal, binormal); // Define a base ortogonal da curva
  carroMontado.setRotationFromMatrix(matrix); // Aplica a rotação ao grupo do carrinho

  // Ajustar a posição do carrinho ligeiramente acima do centro
  carroMontado.position.copy(posicaoCarro);
  carroMontado.position.add(normal.multiplyScalar(0.4)); // Elevar o carro para compensar a profundidade da pista

  // Incrementa o progresso do carrinho na curva
  carProgress += 0.001; // Velocidade do carrinho
  if (carProgress > 1) carProgress = 0; // Recomeça do início da pista
}

// Controle da câmera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suavidade no movimento
controls.enablePan = true; // Permite o movimento horizontal/vertical da câmera
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,  // Botão esquerdo do mouse para rotacionar
  MIDDLE: THREE.MOUSE.DOLLY, // Roda do meio para zoom
  RIGHT: THREE.MOUSE.PAN     // Botão direito para movimentar
};

// Ajustar a posição da câmera para garantir visibilidade
camera.position.set(0, 10, 30);
camera.lookAt(0, 0, 0);

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
