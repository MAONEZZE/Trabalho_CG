import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

class Ceu{
  CriarCeu() {
    // Geometria da esfera para o céu
    const geometriaCeu = new THREE.SphereGeometry(300, 32, 32); // Grande esfera
    const loader = new THREE.TextureLoader();
    const textura = loader.load('./texturaCeu/ceu.jpg');
    const materialCeu = new THREE.MeshPhongMaterial({
      map: textura,
      side: THREE.BackSide, // Inverte a esfera para ser vista de dentro
    });
  
    const ceu = new THREE.Mesh(geometriaCeu, materialCeu);
  
    return ceu;
  }

  CriarNuvem(posX, posY, posZ) {
    const geometriaNuvem = new THREE.PlaneGeometry(20, 10); // Tamanho da nuvem
    const materialNuvem = new THREE.MeshLambertMaterial({color: '#ededed'});
  
    const nuvem = new THREE.Mesh(geometriaNuvem, materialNuvem);
    nuvem.position.set(posX, posY, posZ);
  
    return nuvem;
  }

  CriarNuvens(quantidade) {
    const nuvens = new THREE.Group();
  
    for (let i = 0; i < quantidade; i++) {
      const posX = Math.random() * 600 - 300; 
      const posY = Math.random() * 200 + 100; 
      const posZ = Math.random() * 600 - 300; 
  
      // Use o método escolhido para criar nuvens
      const nuvem = this.CriarNuvemVolumetrica(posX, posY, posZ);
      nuvens.add(nuvem);
    }
  
    return nuvens;
  }

  CriarNuvemVolumetrica(posX, posY, posZ) {
    const nuvem = new THREE.Group();
  
    const geometriaEsfera = new THREE.SphereGeometry(5, 16, 16);
    const materialEsfera = new THREE.MeshLambertMaterial({ color: 0xffffff });
  
    // Esferas para formar a nuvem
    const esfera1 = new THREE.Mesh(geometriaEsfera, materialEsfera);
    const esfera2 = new THREE.Mesh(geometriaEsfera, materialEsfera);
    const esfera3 = new THREE.Mesh(geometriaEsfera, materialEsfera);
  
    esfera2.position.x = 6;
    esfera3.position.x = -6;
  
    nuvem.add(esfera1);
    nuvem.add(esfera2);
    nuvem.add(esfera3);
  
    nuvem.position.set(posX, posY, posZ);
  
    return nuvem;
  }

  MontarCeu() {
    const cena = new THREE.Group();
  
    // Criar o céu
    const ceu = this.CriarCeu();
    cena.add(ceu);
  
    // Criar nuvens
    const nuvens = this.CriarNuvens(100); // Exemplo: 50 nuvens
    cena.add(nuvens);
  
    return cena;
  }
}

export default Ceu;