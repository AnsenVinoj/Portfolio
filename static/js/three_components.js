// --- Global Three.js Setup --- //
const initThreeJS = () => {

    // 1. Particle Background Setup
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const bgScene = new THREE.Scene();
        const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // we use a light alpha clear color or just transparent
        const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });

        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        bgRenderer.setPixelRatio(window.devicePixelRatio);

        // Stars/Particles (Darker blue for light theme)
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.006,
            color: 0x0077ff,
            transparent: true,
            opacity: 0.6,
            blending: THREE.NormalBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        bgScene.add(particlesMesh);

        bgCamera.position.z = 3;

        // Mouse interaction for background
        let mouseX = 0;
        let mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
            mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
        });

        // Background Animation Loop
        const animateBg = () => {
            requestAnimationFrame(animateBg);
            particlesMesh.rotation.y += 0.0005;
            particlesMesh.rotation.x += 0.0002;

            // Mouse parallax effect
            bgCamera.position.x += (mouseX * 0.5 - bgCamera.position.x) * 0.05;
            bgCamera.position.y += (mouseY * 0.5 - bgCamera.position.y) * 0.05;
            bgCamera.lookAt(bgScene.position);

            bgRenderer.render(bgScene, bgCamera);
        };
        animateBg();

        window.addEventListener('resize', () => {
            bgCamera.aspect = window.innerWidth / window.innerHeight;
            bgCamera.updateProjectionMatrix();
            bgRenderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // 2. Hero 3D Model (Live Bending Big Ball)
    const heroContainer = document.getElementById('hero-3d-model');
    if (heroContainer) {
        const heroScene = new THREE.Scene();
        const heroCamera = new THREE.PerspectiveCamera(50, heroContainer.clientWidth / heroContainer.clientHeight, 0.1, 1000);
        const heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        heroRenderer.setSize(window.innerWidth, window.innerHeight);
        heroRenderer.setPixelRatio(window.devicePixelRatio);
        heroContainer.appendChild(heroRenderer.domElement);

        // Big detailed sphere (made larger so only half shows from left)
        const sphereGeo = new THREE.SphereGeometry(3.5, 64, 64);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: 0x0077ff,
            wireframe: true,
            emissive: 0x0077ff,
            emissiveIntensity: 0.2, // lowered emissive for light theme
            transparent: true,
            opacity: 0.6
        });
        const bigBall = new THREE.Mesh(sphereGeo, sphereMat);
        heroScene.add(bigBall);

        // Cache original vertex positions to animate them
        const originalPositions = bigBall.geometry.attributes.position.clone();

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(5, 5, 5);
        heroScene.add(ambientLight, pointLight);

        heroCamera.position.z = 7;

        // Move the ball strictly to the far left edge and centered vertically
        bigBall.position.x = -6;
        bigBall.position.y = 0;

        // Animation Loop
        const clock = new THREE.Clock();
        const v = new THREE.Vector3();

        const animateHero = () => {
            requestAnimationFrame(animateHero);
            const time = clock.getElapsedTime();

            // "Small small bends" effect using sine waves on vertices
            const positions = bigBall.geometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
                v.fromBufferAttribute(originalPositions, i);
                // Compute subtle wobbly noise based on vertex pos and time
                const noise = Math.sin(v.x * 2.5 + time * 2) * Math.cos(v.y * 2.5 + time * 1.5) * Math.sin(v.z * 2.5 + time) * 0.15;
                // Since it's a sphere centered at 0, v is basically its normal direction
                const dir = v.clone().normalize();
                v.addScaledVector(dir, noise);
                positions.setXYZ(i, v.x, v.y, v.z);
            }
            positions.needsUpdate = true;

            bigBall.rotation.x = time * 0.15;
            bigBall.rotation.y = time * 0.2;

            // Float effect
            bigBall.position.y = Math.sin(time) * 0.2;

            heroRenderer.render(heroScene, heroCamera);
        };
        animateHero();

        window.addEventListener('resize', () => {
            heroCamera.aspect = window.innerWidth / window.innerHeight;
            heroCamera.updateProjectionMatrix();
            heroRenderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // 3. Skills Interactive 3D Cubes
    const skillsContainer = document.getElementById('skills-canvas-container');
    const tooltip = document.getElementById('skill-tooltip');
    if (skillsContainer) {
        const skillScene = new THREE.Scene();
        const skillCamera = new THREE.PerspectiveCamera(45, skillsContainer.clientWidth / skillsContainer.clientHeight, 0.1, 1000);
        const skillRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        skillRenderer.setSize(skillsContainer.clientWidth, skillsContainer.clientHeight);
        skillsContainer.appendChild(skillRenderer.domElement);

        const skills = [
            { name: "Python", color: 0x3776ab, pos: [-3, 1, 0], level: "Expert" },
            { name: "Machine Learning", color: 0xff9900, pos: [-1, 1, 0], level: "Advanced" },
            { name: "Deep Learning", color: 0x6600cc, pos: [1, 1, 0], level: "Advanced" },
            { name: "Data Science", color: 0x00cc66, pos: [3, 1, 0], level: "Expert" },
            { name: "Flask & React", color: 0x00d8ff, pos: [-2, -1, 0], level: "Intermediate" },
            { name: "Pandas & Numpy", color: 0xff00ff, pos: [0, -1, 0], level: "Expert" },
            { name: "Git & GitHub", color: 0xf34f29, pos: [2, -1, 2], level: "Advanced" }
        ];

        const skillGroup = new THREE.Group();
        skillScene.add(skillGroup);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const meshes = [];

        skills.forEach((skill, index) => {
            const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
            const mat = new THREE.MeshStandardMaterial({
                color: skill.color,
                wireframe: true,
                emissive: skill.color,
                emissiveIntensity: 0.2, // lowered for light theme
                transparent: true,
                opacity: 0.9
            });
            const cube = new THREE.Mesh(geo, mat);
            cube.position.set(...skill.pos);
            cube.userData = { skillName: skill.name, level: skill.level, baseScale: 1.0 };
            skillGroup.add(cube);
            meshes.push(cube);
        });

        // Lights
        const light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(2, 2, 5);
        skillScene.add(light);

        const amLight = new THREE.AmbientLight(0xffffff, 0.6);
        skillScene.add(amLight);

        skillCamera.position.z = 8;

        let mouseX = 0;
        let mouseY = 0;

        skillsContainer.addEventListener('mousemove', (e) => {
            const rect = skillsContainer.getBoundingClientRect();
            // Normalized device coordinates
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            // Raw mouse positions for group rotation
            mouseX = mouse.x;
            mouseY = mouse.y;

            raycaster.setFromCamera(mouse, skillCamera);
            const intersects = raycaster.intersectObjects(meshes);

            // Reset scales
            meshes.forEach(m => {
                m.scale.set(1, 1, 1);
            });

            if (intersects.length > 0) {
                const target = intersects[0].object;
                target.scale.set(1.4, 1.4, 1.4); // Expand on hover

                // Show Tooltip
                tooltip.classList.remove('d-none');
                tooltip.innerText = `${target.userData.skillName}: ${target.userData.level}`;
                tooltip.style.left = `${e.clientX}px`;
                tooltip.style.top = `${e.clientY + window.scrollY}px`;
                document.body.style.cursor = "pointer";
            } else {
                tooltip.classList.add('d-none');
                document.body.style.cursor = "default";
            }
        });

        skillsContainer.addEventListener('mouseleave', () => {
            tooltip.classList.add('d-none');
        });

        const animateSkills = () => {
            requestAnimationFrame(animateSkills);

            // Interactive tilt
            const targetRotationX = mouseY * 0.2;
            const targetRotationY = mouseX * 0.2;

            skillGroup.rotation.x += (targetRotationX - skillGroup.rotation.x) * 0.05;
            skillGroup.rotation.y += (targetRotationY - skillGroup.rotation.y) * 0.05;

            // Individual rotation
            meshes.forEach(child => {
                child.rotation.y += 0.01;
                child.rotation.x += 0.01;
            });

            skillRenderer.render(skillScene, skillCamera);
        };
        animateSkills();

        window.addEventListener('resize', () => {
            if (!skillsContainer) return;
            skillCamera.aspect = skillsContainer.clientWidth / skillsContainer.clientHeight;
            skillCamera.updateProjectionMatrix();
            skillRenderer.setSize(skillsContainer.clientWidth, skillsContainer.clientHeight);
        });
    }
};

window.addEventListener('load', initThreeJS);
