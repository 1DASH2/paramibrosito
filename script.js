document.addEventListener('DOMContentLoaded', () => {
    // --- SLIDER AUTOMÁTICO ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;
    let currentIndex = 0;
    const intervalTime = 4000;

    function showSlide(index) {
        if (index >= totalSlides) currentIndex = 0;
        else if (index < 0) currentIndex = totalSlides - 1;
        else currentIndex = index;

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

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            clearInterval(sliderInterval);
            const slideIndex = parseInt(e.target.dataset.slide);
            showSlide(slideIndex);
            sliderInterval = setInterval(autoPlay, intervalTime);
        });
    });

    showSlide(currentIndex);
});

// --- FUEGOS ARTIFICIALES ---
document.addEventListener('DOMContentLoaded', function () {
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
            this.distance = Math.hypot(targetX - x, targetY - y);
            this.traveled = 0;
            this.coordinates = Array(3).fill([this.x, this.y]);
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
            this.traveled = Math.hypot(this.targetX - this.x, this.targetY - this.y);
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
            let particleCount = Math.random() * 40 + 60; // reducido para mejor rendimiento
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
            this.speed = Math.random() * 8 + 4;
            this.friction = 0.92;
            this.gravity = 0.7;
            this.coordinates = Array(6).fill([this.x, this.y]);
            this.hue = hue;
            this.brightness = Math.random() * 70 + 30;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.005;
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

        if (Math.random() < 0.03) { // menos frecuencia
            let startX = canvas.width / 2;
            let startY = canvas.height;
            let targetX = Math.random() * (canvas.width - 200) + 100;
            let targetY = Math.random() * (canvas.height / 2);
            fireworks.push(new Firework(startX, startY, targetX, targetY));
        }
    }

    loop();
});

// --- LLUVIA DE PAPITAS ---
function lluviaPapitas() {
    const papita = document.createElement("div");
    papita.classList.add("papita");

    papita.style.left = Math.random() * window.innerWidth + "px";
    papita.style.top = "-80px";

    const size = Math.random() * 40 + 40;
    papita.style.width = size + "px";
    papita.style.height = size + "px";

    document.body.appendChild(papita);

    setTimeout(() => papita.remove(), 4000);
}

document.querySelectorAll(".menu-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        const target = document.querySelector(link.getAttribute("href"));
        target.scrollIntoView({ behavior: "smooth" });

        for (let i = 0; i < 8; i++) { // menos papitas -> menos lag
            setTimeout(lluviaPapitas, i * 250);
        }
    });
});
