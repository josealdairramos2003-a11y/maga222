// --- 1. PANTALLA DE CARGA ---
window.addEventListener("load", () => {
    setTimeout(() => {
        const pantallaCarga = document.getElementById("pantalla-carga");
        const panelSeguridad = document.getElementById("panel-seguridad");
        
        pantallaCarga.style.opacity = "0";
        setTimeout(() => {
            pantallaCarga.style.display = "none";
            panelSeguridad.classList.remove("oculto");
        }, 1000);
    }, 1500); 
});

// --- 2. SISTEMA DE DESBLOQUEO INICIAL ---
const btnIngresar = document.getElementById("btn-ingresar");
const inputPassword = document.getElementById("password");
const mensajeError = document.getElementById("mensaje-error");
const panelSeguridad = document.getElementById("panel-seguridad");
const universoSorpresa = document.getElementById("universo-sorpresa");
const candado = document.getElementById("candado");

// Variables globales para música y video
const musica = document.getElementById("musica-sorpresa");
const btnMusicaPlay = document.getElementById("btn-play");
const animacionDisco = document.querySelector(".disco-girando");
const videoFinal = document.getElementById("video-final");

btnIngresar.addEventListener("click", verificarClave);
inputPassword.addEventListener("keypress", (e) => { if (e.key === "Enter") verificarClave(); });

function verificarClave() {
    const clave = inputPassword.value;
    // CONTRASEÑA CORRECTA: 21022005
    if (clave === "21022005") {
        candado.innerText = "🔓";
        candado.style.transform = "scale(1.3)";
        mensajeError.classList.add("oculto");
        
        setTimeout(() => {
            panelSeguridad.style.opacity = "0";
            setTimeout(() => {
                panelSeguridad.style.display = "none";
                universoSorpresa.classList.remove("oculto");
                document.body.style.overflowY = "auto"; 
                iniciarPetalos(); 
                
                // ARRANCAMOS LA MÚSICA DE FONDO AL ENTRAR
                musica.volume = 0.5;
                musica.play().catch(e => console.log("Auto-play bloqueado por el navegador", e));
                if (btnMusicaPlay) btnMusicaPlay.innerText = "⏸️";
                if (animacionDisco) animacionDisco.style.animationPlayState = "running";
                
            }, 1000);
        }, 500);
    } else {
        mensajeError.classList.remove("oculto");
        inputPassword.value = "";
        document.querySelector(".caja-login").animate([
            { transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }
        ], { duration: 300 });
    }
}

// --- 3. TERMINAL HACKER Y VIDEO SECRETO ---
const inputHacker = document.getElementById("input-hacker");
const pantallaConsola = document.getElementById("pantalla-consola");
const regaloHackeado = document.getElementById("regalo-hackeado");

if(inputHacker) {
    inputHacker.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            const comando = inputHacker.value.toLowerCase().trim();
            const nuevaLinea = document.createElement("p");
            nuevaLinea.className = "texto-verde";
            
            if (comando === "te amo") {
                nuevaLinea.innerText = "> Acceso concedido. Desencriptando video secreto...";
                pantallaConsola.appendChild(nuevaLinea);
                inputHacker.disabled = true;
                
                setTimeout(() => {
                    // Revela la caja del video
                    regaloHackeado.classList.remove("oculto");
                    regaloHackeado.scrollIntoView({ behavior: 'smooth' });
                    
                    // Pausa la música de fondo
                    if (!musica.paused) {
                        musica.pause();
                        if (btnMusicaPlay) btnMusicaPlay.innerText = "▶️";
                        if (animacionDisco) animacionDisco.style.animationPlayState = "paused";
                    }

                    // Dale play al video secreto automáticamente
                    if(videoFinal) {
                        videoFinal.play().catch(e => console.log("Video auto-play bloqueado", e));
                    }
                    
                }, 1500);
            } else {
                nuevaLinea.style.color = "#f00";
                nuevaLinea.style.textShadow = "0 0 5px #f00";
                nuevaLinea.innerText = "> Error: Comando incorrecto. Intenta de nuevo.";
                pantallaConsola.appendChild(nuevaLinea);
            }
            inputHacker.value = "";
        }
    });
}

// --- 4. VIDEO TERMINA -> VUELVE LA MÚSICA ---
if(videoFinal) {
    videoFinal.addEventListener("ended", () => {
        musica.volume = 0.5;
        musica.play(); 
        
        if (btnMusicaPlay) btnMusicaPlay.innerText = "⏸️";
        if (animacionDisco) animacionDisco.style.animationPlayState = "running";
    });
}

// --- 5. ANIMACIONES AL HACER SCROLL (EL BUG ESTABA AQUÍ) ---
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            if(entrada.target.classList.contains('seccion-carta') && !cartaEscrita) {
                setTimeout(escribirCarta, 500);
                cartaEscrita = true;
            }
        }
    });
}, { threshold: 0.02 }); // <-- ¡AQUÍ ESTÁ LA MAGIA! Lo bajamos a 0.02.
document.querySelectorAll('.animar-scroll').forEach(el => observador.observe(el));

// --- 6. CONTROLES MANUALES DE MÚSICA VIP ---
if(btnMusicaPlay) {
    btnMusicaPlay.addEventListener("click", () => {
        if (musica.paused) {
            musica.volume = 0.5;
            musica.play();
            btnMusicaPlay.innerText = "⏸️";
            if(animacionDisco) animacionDisco.style.animationPlayState = "running";
        } else {
            musica.pause();
            btnMusicaPlay.innerText = "▶️";
            if(animacionDisco) animacionDisco.style.animationPlayState = "paused";
        }
    });
}

// --- 7. BÓVEDA DE AUDIOS ---
let audioActual = null;
let animacionActual = null;

function reproducirNota(rutaAudio, btn) {
    if (audioActual && !audioActual.paused && audioActual.src !== rutaAudio) {
        audioActual.pause();
        if(animacionActual) animacionActual.classList.remove("animando");
    }

    const ondas = btn.nextElementSibling;

    if (!audioActual || audioActual.src !== rutaAudio) {
        audioActual = new Audio(rutaAudio);
    }

    if (audioActual.paused) {
        musica.pause(); 
        if (btnMusicaPlay) btnMusicaPlay.innerText = "▶️";
        if (animacionDisco) animacionDisco.style.animationPlayState = "paused";
        
        audioActual.play();
        btn.innerText = "⏸️";
        ondas.classList.add("animando");
        animacionActual = ondas;

        audioActual.onended = () => {
            btn.innerText = "▶️";
            ondas.classList.remove("animando");
        };
    } else {
        audioActual.pause();
        btn.innerText = "▶️";
        ondas.classList.remove("animando");
    }
}

// --- 8. MÁQUINA DE ESCRIBIR (LA CARTA) ---
const cartaRomantica = "He guardado estos momentos porque cada uno contigo es especial. Hoy celebramos tu vida, tu sonrisa y todo lo que te hace increíble. No importa cuánto bajes por esta pantalla siempre sabras lo que eres tu para mi, lo que siento por ti no tiene un final. Gracias por ser mi lugar seguro. ¡Feliz Cumpleaños Mi charapita Mi maga Mi amor! ❤️";
let indiceCarta = 0;
let cartaEscrita = false;

function escribirCarta() {
    if (indiceCarta < cartaRomantica.length) {
        document.getElementById("texto-maquina").innerHTML += cartaRomantica.charAt(indiceCarta);
        indiceCarta++;
        setTimeout(escribirCarta, 45); 
    }
}

// --- 9. SISTEMA DE PÉTALOS CAYENDO ---
function iniciarPetalos() {
    const canvas = document.getElementById("petalos");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let petalosArray = [];
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    class Petalo {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.w = Math.random() * 15 + 10;
            this.h = Math.random() * 10 + 5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.velX = Math.random() * 2 - 1;
            this.velY = Math.random() * 2 + 1;
            this.rotacion = Math.random() * 360;
            this.velRotacion = Math.random() * 2 - 1;
        }
        dibujar() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotacion * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(this.w / 2, -this.h / 2, this.w, 0, 0, this.h);
            ctx.bezierCurveTo(-this.w, 0, -this.w / 2, -this.h / 2, 0, 0);
            ctx.fillStyle = "#ff4d6d";
            ctx.fill();
            ctx.restore();
        }
        actualizar() {
            this.x += this.velX;
            this.y += this.velY;
            this.rotacion += this.velRotacion;
            this.x += Math.sin(this.y * 0.01) * 0.5;

            if (this.y > canvas.height + 20) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
            this.dibujar();
        }
    }

    for (let i = 0; i < 40; i++) {
        petalosArray.push(new Petalo());
    }

    function animarPetalos() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petalosArray.forEach(petalo => petalo.actualizar());
        requestAnimationFrame(animarPetalos);
    }
    animarPetalos();
}