let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let cubeGlowIndex = 0; 
let triangleGlowIndex = 0; 

document.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y,
    };

    backgroundScene.children.forEach((pyramid) => {
      pyramid.rotation.x += deltaMove.y * 0.01;
      pyramid.rotation.y += deltaMove.x * 0.01;
    });

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }
});

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth',
        });
      }
    });
  });
}

function setupMultiplePyramidsAndBouncingCubes() {
  const numberOfPyramids = 2;
  const pyramidSpacing = 2;

  const backgroundScene = new THREE.Scene();
  const aspectRatio = window.innerWidth / window.innerHeight;
  const backgroundCamera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  backgroundCamera.position.z = 10;
  const backgroundRenderer = new THREE.WebGLRenderer({ alpha: true });
  backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('cube-container').appendChild(backgroundRenderer.domElement);
  document.body.style.backgroundColor = 'black';
  backgroundRenderer.setClearColor(0x000000, 0);

  const pyramidSize = aspectRatio > 1 ? 4 : 8;
  const backgroundPyramidGeometry = new THREE.ConeGeometry(pyramidSize, pyramidSize, 4, 1, true);
  const backgroundPyramidMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

  for (let i = 0; i < numberOfPyramids; i++) {
    const pyramid = new THREE.Mesh(backgroundPyramidGeometry, backgroundPyramidMaterial);
    pyramid.position.set((i - (numberOfPyramids - 1) / 2) * pyramidSpacing, 0, 0);
    backgroundScene.add(pyramid);
  }

 const cubeSize = 2;
  const cubeSpacing = 6;
  const cubes = []; 

  for (let i = 0; i < 4; i++) {
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]; // Different cube colors.
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: cubeColors[i], transparent: true, opacity: 0.8 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    let x, z;

    switch(i) {
      case 0:
        x = cubeSpacing / 2;
        z = cubeSpacing / 2;
        break;
      case 1:
        x = -cubeSpacing / 2;
        z = cubeSpacing / 2;
        break;
      case 2:
        x = cubeSpacing / 2;
        z = -cubeSpacing / 2;
        break;
      case 3:
        x = -cubeSpacing / 2;
        z = -cubeSpacing / 2;
        break;
    }

    cube.position.set(x, cubeSize / 2, z);
    cubes.push(cube); 
    backgroundScene.add(cube);
  }
  function glowCubes() {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]; 
    const nextColor = colors[cubeGlowIndex % colors.length];

    cubes[cubeGlowIndex].material.color.setHex(nextColor);

    cubeGlowIndex++;
    if (cubeGlowIndex < cubes.length)
    {
      setTimeout(glowCubes, 1000); 
    }
  }
  function glowPyramids() {
    const colors = [0xff0000, 0x00ff00, 0x0000ff];
    const nextColor = colors[triangleGlowIndex % colors.length];

    backgroundScene.children.forEach((pyramid) => {
      pyramid.material.color.setHex(nextColor);
    });

    triangleGlowIndex++;
    setTimeout(glowPyramids, 1000); 
  }

  glowCubes(); 
  glowPyramids(); 

  const animateBackground = () => {
    requestAnimationFrame(animateBackground);

    backgroundScene.children.forEach((pyramid) => {
      pyramid.rotation.x += 0.005;
      pyramid.rotation.y += 0.005;
    });

    backgroundCamera.aspect = window.innerWidth / window.innerHeight;
    backgroundCamera.updateProjectionMatrix();

    backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
    backgroundRenderer.render(backgroundScene, backgroundCamera);
  };

  animateBackground();
}

setupSmoothScrolling();
setupMultiplePyramidsAndBouncingCubes();
