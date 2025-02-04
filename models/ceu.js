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

  MontarCeu() {
    const cena = new THREE.Group();
  
    // Criar o céu
    const ceu = this.CriarCeu();
    cena.add(ceu);
  
    return cena;
  }
}

export default Ceu;