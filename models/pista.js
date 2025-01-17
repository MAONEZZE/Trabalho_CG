import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

class Pista {
  constructor() {
    this.posicaoPilares = [];
  }

  Curvas() {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 5, 0),
      new THREE.Vector3(20, 2, 18),
      new THREE.Vector3(50, 0, 50),
      new THREE.Vector3(70, 0, 5),
      new THREE.Vector3(5, 10, -30),
      new THREE.Vector3(0, 5, 0),
    ]);
  }

  CriarTabua(posicao, rotacao) {
    const largura = 1; // Largura da tábua
    const comprimento = 3; // Comprimento da tábua
    const espessura = 0.2; // Espessura da tábua

    const geometriaTabua = new THREE.BoxGeometry(comprimento, espessura, largura);
    const materialTabua = new THREE.MeshStandardMaterial({
      color: '#8B4513', // Cor marrom para a madeira
      roughness: 0.8,
    });

    const tabua = new THREE.Mesh(geometriaTabua, materialTabua);

    // Posiciona e rotaciona a tábua
    tabua.position.copy(posicao);
    tabua.rotation.copy(rotacao);

    return tabua;
  }

  CriarPilar(posicao) {
    const geometriaPilar = new THREE.CylinderGeometry(0.6, 0.2, 9, 32); // Cilindro para o pilar
    const materialPilar = new THREE.MeshStandardMaterial({ color: '#532500' }); // Cor marrom para os pilares
    const pilar = new THREE.Mesh(geometriaPilar, materialPilar);

    // Ajustar a posição do pilar, colocando ele abaixo da pista
    const posX = posicao.x;
    const posY = posicao.y - 4.5;
    const posZ = posicao.z;

    const objPos = { x: posX, y: posY, z: posZ };

    this.posicaoPilares.push(objPos);

    pilar.position.set(posX, posY, posZ); // Desce o pilar para baixo da pista

    return pilar;
  }

  LinhaPista(curvas) {
    const linhas = new THREE.Group();
    const formatolinha = new THREE.Shape();

    formatolinha.lineTo(0.1, 0);

    const geometriaLinha = new THREE.ExtrudeGeometry(formatolinha, {
      steps: 1000,
      extrudePath: curvas,
    });

    const materialLinha = new THREE.MeshStandardMaterial({ color: '#813a02' });
    const linha1 = new THREE.Mesh(geometriaLinha, materialLinha);

    // Ajustar posição e orientação da linha1 no centro da pista
    linha1.position.y = 0;
    linha1.position.x = 0.9;
    linha1.position.z = 0.3;

    const linha2 = linha1.clone();

    linha2.position.y = 0.1;
    linha2.position.x = -1;
    linha2.position.z = 0.15;

    linhas.add(linha1);
    linhas.add(linha2);

    return linhas;
  }

  MontagemPista() {
    const curvas = this.Curvas();

    // Definir o número de tábuas
    const numeroDeTabuas = 180; // Ajuste o número conforme necessário

    // Obter pontos igualmente espaçados ao longo da curva
    const pontosEspacados = curvas.getSpacedPoints(numeroDeTabuas - 1);

    const tabuas = [];

    pontosEspacados.forEach((ponto, index) => {
      // Obter a tangente no ponto para calcular a rotação
      const tangente = curvas.getTangentAt(index / (numeroDeTabuas - 1));
      const rotacao = new THREE.Euler(0, Math.atan2(tangente.x, tangente.z), 0);

      // Criar a tábua e adicioná-la à lista
      const tabua = this.CriarTabua(ponto, rotacao);
      tabuas.push(tabua);
    });

    // Criar pilares
    const pilares = [];
    const numeroDePilares = 20;
    for (let i = 0; i < numeroDePilares; i++) {
      const posicaoCurva = curvas.getPointAt(i / numeroDePilares);
      const pilar = this.CriarPilar(posicaoCurva);
      pilares.push(pilar);
    }

    const grupoPista = new THREE.Group();
    tabuas.forEach(tabua => grupoPista.add(tabua));
    pilares.forEach(pilar => grupoPista.add(pilar));
    grupoPista.add(this.LinhaPista(curvas));

    return [grupoPista, curvas, this.posicaoPilares];
  }
}

export default Pista;