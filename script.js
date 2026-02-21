// --- 1. LÓGICA DE LOS ANILLOS Y EL RELOJ ---
const fechaObjetivo = new Date("Feb 20, 2026 00:00:00").getTime();
const circunferencia = 314;

const intervalo = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = fechaObjetivo - ahora;

   if (distancia < 0) {
        clearInterval(intervalo);
        
        // 👇 ESTE ES EL CAMBIO 👇
        window.location.href = "sorpresa.html"; 
        
        return;
    }   

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    document.getElementById("dias").innerText = dias.toString().padStart(2, '0');
    document.getElementById("horas").innerText = horas.toString().padStart(2, '0');
    document.getElementById("minutos").innerText = minutos.toString().padStart(2, '0');
    document.getElementById("segundos").innerText = segundos.toString().padStart(2, '0');

    document.getElementById("circulo-dias").style.strokeDashoffset = circunferencia - (circunferencia * (dias / 365));
    document.getElementById("circulo-horas").style.strokeDashoffset = circunferencia - (circunferencia * (horas / 24));
    document.getElementById("circulo-minutos").style.strokeDashoffset = circunferencia - (circunferencia * (minutos / 60));
    document.getElementById("circulo-segundos").style.strokeDashoffset = circunferencia - (circunferencia * (segundos / 60));
}, 1000);

// --- 2. LÓGICA DEL CANVA (Lluvia y Explosiones de Corazones) ---
const canvas = document.getElementById("universo");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let corazones = [];

// Función matemática para dibujar un corazón perfecto
function dibujarCorazon(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -3, -5, -3, -5, 0);
    ctx.bezierCurveTo(-5, 3, 0, 5, 0, 8);
    ctx.bezierCurveTo(0, 5, 5, 3, 5, 0);
    ctx.bezierCurveTo(5, -3, 0, -3, 0, 0);
    ctx.fill();
    ctx.restore();
}

class Corazon {
    constructor(x, y, isExplosion = false) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5 + 0.5; // Tamaño aleatorio
        this.alpha = 1;
        
        // Colores románticos aleatorios
        const colores = ['#ff4d6d', '#ff8fa3', '#c9184a', '#ffb3c1'];
        this.color = colores[Math.floor(Math.random() * colores.length)];

        this.isExplosion = isExplosion;

        if (isExplosion) {
            // Si es explosión, salen disparados en todas direcciones 360 grados
            const angulo = Math.random() * Math.PI * 2;
            const velocidad = Math.random() * 5 + 2;
            this.vx = Math.cos(angulo) * velocidad;
            this.vy = Math.sin(angulo) * velocidad;
            this.decay = Math.random() * 0.015 + 0.01; // Qué tan rápido desaparecen
        } else {
            // Si flotan, solo suben lentamente
            this.vx = (Math.random() - 0.5) * 1; 
            this.vy = Math.random() * -2 - 0.5;
            this.decay = 0.002;
        }
    }

    actualizar() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;

        // Movimiento ondulado ligero si están flotando
        if (!this.isExplosion) {
            this.x += Math.sin(this.y * 0.05) * 0.5;
        }

        dibujarCorazon(ctx, this.x, this.y, this.size, this.color, Math.alpha = Math.max(0, this.alpha));
    }
}

// Crear corazones flotantes de fondo constantemente
setInterval(() => {
    if(corazones.length < 150) {
        corazones.push(new Corazon(Math.random() * canvas.width, canvas.height + 20, false));
    }
}, 150);

// Crear explosión de corazones y reproducir música al hacer clic
window.addEventListener('click', (e) => {
    // 1. Explosión de corazones
    for(let i = 0; i < 30; i++) {
        corazones.push(new Corazon(e.clientX, e.clientY, true));
    }

    // 2. Reproducir la música en el primer clic
    const musica = document.getElementById("musica-fondo");
    const textoInstruccion = document.querySelector(".instruccion");

    if (musica.paused) {
        musica.volume = 0.6; // Volumen al 60% para que no asuste
        musica.play().catch(error => console.log("El navegador bloqueó el audio:", error));
        
        // Pequeño detalle: Cambiamos el texto sutilmente después del primer clic
        if (textoInstruccion) {
            textoInstruccion.innerText = "Espera al 21 :v ✨";
            textoInstruccion.style.animation = "none"; // Detenemos el pulso
            textoInstruccion.style.opacity = "0.8";
        }
    }
});

// Dejar estela de corazones al mover el mouse
window.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.5) { // Para que no sean demasiados y se sature
        let corazonEstela = new Corazon(e.clientX, e.clientY, true);
        corazonEstela.vx = (Math.random() - 0.5) * 2;
        corazonEstela.vy = (Math.random() - 0.5) * 2;
        corazonEstela.decay = 0.03; // Desaparecen rápido
        corazones.push(corazonEstela);
    }
});
// --- SOPORTE PARA PANTALLAS TÁCTILES (Celulares) ---

// 1. Cuando toca la pantalla por primera vez (Explosión y Música)
window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0]; // Obtiene la posición del dedo
    
    // Explosión de corazones
    for(let i = 0; i < 30; i++) {
        corazones.push(new Corazon(touch.clientX, touch.clientY, true));
    }

    // Reproducir la música
    const musica = document.getElementById("musica-fondo");
    const textoInstruccion = document.querySelector(".instruccion");

    if (musica.paused) {
        musica.volume = 0.6;
        musica.play().catch(error => console.log("El navegador bloqueó el audio:", error));
        
        if (textoInstruccion) {
            textoInstruccion.innerText = "Espera al 21 :v ✨";
            textoInstruccion.style.animation = "none";
            textoInstruccion.style.opacity = "0.8";
        }
    }
});

// 2. Cuando arrastra el dedo por la pantalla (Estela de corazones)
window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    
    if (Math.random() > 0.5) { 
        let corazonEstela = new Corazon(touch.clientX, touch.clientY, true);
        corazonEstela.vx = (Math.random() - 0.5) * 2;
        corazonEstela.vy = (Math.random() - 0.5) * 2;
        corazonEstela.decay = 0.03;
        corazones.push(corazonEstela);
    }
});

function animar() {
    requestAnimationFrame(animar);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < corazones.length; i++) {
        corazones[i].actualizar();
        // Eliminar corazones que ya no se ven
        if (corazones[i].alpha <= 0) {
            corazones.splice(i, 1);
            i--;
        }
    }
}


animar();
