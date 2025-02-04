import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

class Chao {
  constructor(pilares) {
    this.pilares = pilares;
  }

  LoadTextura(largura, profundidade) {
    const loader = new THREE.TextureLoader();
    
    const textura = loader.load('./texturaChao/textura.jpg');
    const texturaRugosidade = loader.load('./texturaChao/sombra1.png');
    const texturaNormal = loader.load('./texturaChao/sombra2.jpg');

    // Configurando a textura para repetir no chão
    [textura, texturaRugosidade, texturaNormal].forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(largura, profundidade); 
    });

    const material = new THREE.MeshStandardMaterial({
      map: textura,
      roughnessMap: texturaRugosidade,
      normalMap: texturaNormal,
    });

    return material;
  }

  FormatoMontanha(x, y, z) {
    // Criar geometria mais arredondada (com bordas suavizadas)
    const geometriaMontanha = new THREE.BoxGeometry(x, y, z, 10, 10, 10); // Adicionar subdivisões para suavizar

    // Modificar os vértices para "arredondar" o objeto
    const vertices = geometriaMontanha.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const vx = vertices.getX(i);
      const vy = vertices.getY(i);
      const vz = vertices.getZ(i);

      // Arredondar os vértices puxando-os para mais próximo do centro
      const fator = 15; 
      const comprimento = Math.sqrt(vx ** 2 + vy ** 2 + vz ** 2); 
      vertices.setXYZ(
        i,
        vx + (vx / comprimento) * fator,
        vy + (vy / comprimento) * fator,
        vz + (vz / comprimento) * fator
      );
    }

    vertices.needsUpdate = true; // Atualizar geometria após manipulação
    geometriaMontanha.computeVertexNormals(); // Recalcular as normais para suavizar

    // Criar material
    const montanha = new THREE.Mesh(geometriaMontanha, this.LoadTextura(1, 1));

    return montanha;
  }

  PosicaoMontanha(montanha, x = false, y = false, z = false) {
    montanha.position.x = x;
    montanha.position.y = y;
    montanha.position.z = z;
  }

  CriarArvore() {
    const group = new THREE.Group();

    // Tronco
    const geometriaTronco = new THREE.CylinderGeometry(0.5, 0.5, 15, 16);
    const materialTronco = new THREE.MeshStandardMaterial({ color: '#502808' });
    const tronco = new THREE.Mesh(geometriaTronco, materialTronco);
    tronco.position.y = 2.5;

    // Folhas
    const geometriaFolhas = new THREE.SphereGeometry(4, 16, 16);
    const materialFolhas = new THREE.MeshStandardMaterial({ color: '#365b12' });
    const folhas = new THREE.Mesh(geometriaFolhas, materialFolhas);
    folhas.position.y = 12;

    // Adicionar ao grupo
    group.add(tronco);
    group.add(folhas);

    return group;
  }

  CriarArvores(chaoLargura, chaoProfundidade, quantidade) {
    const arvores = new THREE.Group();

    for (let i = 0; i < quantidade; i++) {
      const arvore = this.CriarArvore();

      // Posição aleatória dentro dos limites do chão
      const posX = Math.random() * chaoLargura - chaoLargura / 2; // Limite X
      const posZ = Math.random() * chaoProfundidade - chaoProfundidade / 2; // Limite Z

      // Para não nascer no relevo  
      if (Math.abs(posX) > 20 && Math.abs(posZ) > 20) {
        arvore.position.set(posX, -3.6, posZ);
        arvores.add(arvore);
      }
    }

    return arvores;
  }

  CriarRelevo() {
    const montanhas = new THREE.Group();

    const montanha1 = this.FormatoMontanha(10, 7, 32);
    this.PosicaoMontanha(montanha1, 10, -10, -18);
    montanha1.rotation.y = -1;

    const montanha2 = this.FormatoMontanha(10, 10, 32);
    this.PosicaoMontanha(montanha2, 5, -13, -30);
    montanha2.rotation.y = -1;

    const montanha3 = this.FormatoMontanha(50, 5, 60);
    this.PosicaoMontanha(montanha3, 15, -7.5, -20);
    montanha3.rotation.y = -1;

    const montanha4 = this.FormatoMontanha(5, 5, 5);
    this.PosicaoMontanha(montanha4, 33, -13, -24);

    montanhas.add(montanha1);
    montanhas.add(montanha2);
    montanhas.add(montanha3);
    montanhas.add(montanha4);

    return montanhas;
  }

  CriarChao() {
    // Adicionar o chão infinito com múltiplas texturas
    const chaoFormado = new THREE.Group();

    // Criando o chão infinito
    const geometriaChao = new THREE.PlaneGeometry(600, 600); 
    const chao = new THREE.Mesh(geometriaChao, this.LoadTextura(20, 20));
    chao.rotation.x = -Math.PI / 2; // Rotaciona o plano para ficar na horizontal
    chao.position.y = -3.6; // Abaixo da pista para evitar interferência

    const montanha = this.CriarRelevo();

    const arvores = this.CriarArvores(500, 500, 300)

    chaoFormado.add(montanha);
    chaoFormado.add(chao);
    chaoFormado.add(arvores);

    return chaoFormado;
  }
}

export default Chao;