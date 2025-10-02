document.addEventListener('DOMContentLoaded', () => {

    const POTATO_IMAGE_PATH = 'imagenes/papita.png'; 
    const BALLOON_IMAGE_PATH = 'imagenes/globo.png';

    document.querySelectorAll('.menu-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Realiza el scroll suave
                window.scrollTo({
                    top: targetElement.offsetTop - document.getElementById('cabecera').offsetHeight,
                    behavior: 'smooth'
                });

                // Llama a la función para la lluvia de papitas
                startPotatoRain();
            }
        });
    });
    let potatoInterval;
    const potatoContainer = document.createElement('div');
    potatoContainer.id = 'potato-rain-container'; 
    document.body.appendChild(potatoContainer);

    function createPotato() {
        const potato = document.createElement('img');
        
        potato.src = POTATO_IMAGE_PATH;
        potato.alt = 'Papita'; 
        potato.classList.add('potato-drop'); 

        potato.style.left = `${Math.random() * 100}vw`;

        const duration = Math.random() * 3 + 2; 
        potato.style.animationDuration = `${duration}s`;

        potatoContainer.appendChild(potato);

        potato.addEventListener('animationend', () => {
            potato.remove();
        });
    }

    function startPotatoRain() {
        if (potatoInterval) {
            clearInterval(potatoInterval);
        }

        potatoInterval = setInterval(createPotato, 100);

        setTimeout(() => {
            clearInterval(potatoInterval);
        }, 5000);
    }
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;
    let currentIndex = 0;
    const intervalTime = 4000;
    const body = document.body; 

    function showSlide(index) {
        if (index >= totalSlides) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalSlides - 1;
        } else {
            currentIndex = index;
        }

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    function autoPlay() {
        currentIndex++;
        showSlide(currentIndex);
    }

    let sliderInterval = setInterval(autoPlay, intervalTime);

    // 1. Detección de clic en los DOTS (solo para navegar)
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            clearInterval(sliderInterval);

            const slideIndex = parseInt(e.target.dataset.slide);
            showSlide(slideIndex);

            sliderInterval = setInterval(autoPlay, intervalTime);
        });
    });

    
    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            // Activa/desactiva el modo Neón
            body.classList.toggle('neon-mode');
            if (body.classList.contains('neon-mode')) {
                startBalloonFloat();
            } else {
                stopBalloonFloat();
            }
        });
    });

    showSlide(currentIndex);
    let balloonInterval;
    const balloonContainer = document.createElement('div');
    balloonContainer.id = 'balloon-container';
    document.body.appendChild(balloonContainer);

    function createBalloon() {
        const balloon = document.createElement('img');
        
        balloon.src = BALLOON_IMAGE_PATH;
        balloon.classList.add('balloon-drop');

        balloon.style.left = `${Math.random() * 100}vw`;

        const duration = Math.random() * 10 + 7;
        balloon.style.animationDuration = `${duration}s`;

        // Pequeño retraso de inicio para escalonar
        const delay = Math.random() * 5; 
        balloon.style.animationDelay = `-${delay}s`;

        balloonContainer.appendChild(balloon);
        balloon.addEventListener('animationend', () => {
            balloon.remove();
        });
    }

    function startBalloonFloat() {
        // Asegúrate de que no haya otro intervalo corriendo
        if (balloonInterval) {
            clearInterval(balloonInterval);
        }

        // Crea un nuevo globo cada 400 milisegundos (ajusta si quieres más/menos)
        balloonInterval = setInterval(createBalloon, 400); 
    }
    
    function stopBalloonFloat() {
       
        if (balloonInterval) {
            clearInterval(balloonInterval);
        }
    }

    const canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let fireworks = [];
    const particles = [];
    let hue = 0;

    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Firework {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = 2;
            this.angle = Math.atan2(targetY - y, targetX - x);
            this.distance = Math.sqrt((targetX - x) ** 2 + (targetY - y) ** 2);
            this.traveled = 0;
            this.coordinates = [];
            this.coordinateCount = 3;
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.hue = hue;
            this.brightness = Math.random() * 40 + 70;
        }

        update() {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            if (this.traveled >= this.distance) {
                this.createParticles();
                return true;
            }

            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            this.traveled = this.distance - Math.sqrt(dx * dx + dy * dy);

            return false;
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
            ctx.stroke();
        }

        createParticles() {
            let particleCount = Math.random() * 120 + 200;
            while (particleCount--) {
                particles.push(new Particle(this.targetX, this.targetY, this.hue));
            }
        }
    }

    class Particle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 20 + 8;
            this.friction = 0.93;
            this.gravity = 0.8;
            this.coordinates = [];
            this.coordinateCount = 6;
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.hue = hue;
            this.brightness = Math.random() * 70 + 30;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.003;
        }

        update() {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;

            return this.alpha <= this.decay;
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
            ctx.stroke();
        }
    }

    function loop() {
        requestAnimationFrame(loop);

        hue += 0.5;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        let i = fireworks.length;
        while (i--) {
            if (fireworks[i].update()) {
                fireworks.splice(i, 1);
            } else {
                fireworks[i].draw();
            }
        }

        i = particles.length;
        while (i--) {
            if (particles[i].update()) {
                particles.splice(i, 1);
            } else {
                particles[i].draw();
            }
        }

        if (Math.random() < 0.05) {
            const startX = Math.random() * (canvas.width - 200) + 100;
            const startY = canvas.height;
            const targetX = Math.random() * (canvas.width - 200) + 100;
            const targetY = Math.random() * (canvas.height / 2);
            fireworks.push(new Firework(startX, startY, targetX, targetY));
        }
    }

    loop();
});
