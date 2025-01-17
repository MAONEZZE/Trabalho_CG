import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

class Carro {
  Corpo(){
    const geometria = new THREE.BoxGeometry(2.5, 1, 1.5); // Largura, altura e comprimento
    const material = new THREE.MeshStandardMaterial({ color: '#0f3603' }); // Cor vermelha típica
    const corpo = new THREE.Mesh(geometria, material);
    corpo.position.y = 0.5; // Elevar o corpo do carro

    return corpo;
  }

  Parachoque_Baixo(){
    const geometria = new THREE.BoxGeometry(1.4, 0.2, 1);
    const material = new THREE.MeshStandardMaterial({ color: '#000000' }); // Cor cinza
    const parachoque = new THREE.Mesh(geometria, material);
    parachoque.position.set(1, 0.2, 0);
    parachoque.rotation.y = Math.PI / 2; // Rotação para inclinar o parachoque

    return parachoque;
  }

  Parachoque_Cima(){
    const geometria = new THREE.BoxGeometry(1.4, 0.1, 1);
    const material = new THREE.MeshStandardMaterial({ color: '#000000' }); // Cor cinza
    const parachoque = new THREE.Mesh(geometria, material);
    parachoque.position.set(1, 0.9, 0);
    parachoque.rotation.y = Math.PI / 2; // Rotação para inclinar o parachoque

    return parachoque;
  }

  Paralama(){
    const geometria = new THREE.BoxGeometry(1.3, 0.9, 0.1);
    const material = new THREE.MeshStandardMaterial({ color: '#000000' }); // Cor cinza
    const paralama = new THREE.Mesh(geometria, material);
    paralama.position.set(-1.3, 0.5, 0);
    paralama.rotation.y = Math.PI / 2;

    return paralama;
  }

  Rodas(montagem){
    const geometria = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 20);
    const material = new THREE.MeshStandardMaterial({ color: '#090909' });
    const posicao = [
      [-0.8, 0, -0.9], // Frente esquerda
      [-0.8, 0, 0.9],  // Traseira esquerda
      [1.1, 0, -0.9],  // Frente direita
      [1.1, 0, 0.9],   // Traseira direita
    ];

    posicao.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(geometria, material);
      wheel.rotation.x = Math.PI / 2; // Rotação para alinhar no eixo correto
      wheel.position.set(x, y, z);
      montagem.add(wheel);
    });
  }

  Farois(){
    const geometria = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 20);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const farol1 = new THREE.Mesh(geometria, material);
    const farol2 = farol1.clone();

    farol1.position.set(1.3, 0.6, 0.5);
    farol2.position.set(1.3, 0.6, -0.5);

    farol1.rotation.z = Math.PI / 2; 
    farol2.rotation.z = Math.PI / 2; 
    
    return [farol1, farol2];
  }

  GradeFrontal(montagem){
    for (let i = -0.6; i <= 0.6; i += 0.3) {
      const geometria = new THREE.BoxGeometry(0.1, 0.7, 0.05);
      const material = new THREE.MeshStandardMaterial({ color: '#000000' });
      const grade = new THREE.Mesh(geometria, material);

      grade.position.set(1.4, 0.5, -0.02);
      grade.position.z += i;

      montagem.add(grade);
    }
  }

  Step(){
    const geometria = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 20);
    const material = new THREE.MeshStandardMaterial({ color: '#090909' });

    const step = new THREE.Mesh(geometria, material);
    step.rotation.z = Math.PI / 2; // Rotação para alinhar no eixo correto
    step.position.set(-1.5, 0.5, 0);
    
    return step;
  }

  ParteCima(){
    const geometria = new THREE.BoxGeometry(1.5, 1, 1.4);
    const material = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const parteCima = new THREE.Mesh(geometria, material);
    parteCima.position.set(-0.4, 1.2, 0);

    return parteCima;
  }

  MontagemCarro() {
    const montagem = new THREE.Group();

    // Corpo principal do carro
    const corpo = this.Corpo();
    montagem.add(corpo);

    // Parachoque frontal
    const parachoque_baixo = this.Parachoque_Baixo();  
    montagem.add(parachoque_baixo);

    // Parachoque frontal
    const parachoque_cima = this.Parachoque_Cima();  
    montagem.add(parachoque_cima);

    // Paralama traseiro
    const paralama = this.Paralama();
    montagem.add(paralama);

    // Rodas 
    this.Rodas(montagem);

    // Step
    const step = this.Step();
    montagem.add(step);

    // Faróis frontais
    const [farol1, farol2] = this.Farois();
    montagem.add(farol1, farol2);

    // Grade frontal
    this.GradeFrontal(montagem);

    // Capota
    const parteCima = this.ParteCima();    
    montagem.add(parteCima);

    return montagem;
  }
}

export default Carro;