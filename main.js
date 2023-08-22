const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const jugador = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    velocidad: 10,
    vidas: 3,
    puntos: 0
};

const meteoritos = [];
const corazones = [];
const disparos = [];

const cuadroLetras = {
    x: canvas.width - 100,
    y: 0,
    ancho: 100,
    alto: 50
};

const cuadroScore = {
    x: canvas.width / 2 - 250,
    y: 0,
    ancho: 100,
    alto: 45
};

const cuadroVidas = {
    x: 0,
    y: 0,
    ancho: 85,
    alto: 45
};

const jugadorImagen = new Image();
jugadorImagen.src = 'img/cupi.png';

const gifImagen = new Image();
gifImagen.src = 'img/CorazonCupido.gif';

let corazonCaido = false;

function dibujarJugador() {
    ctx.drawImage(jugadorImagen, jugador.x - 40, jugador.y - 40, 120, 80);
}

function dibujarCorazon() {
    ctx.drawImage(gifImagen, jugador.x - 40, jugador.y - 500, 60, 90);
}

function dibujarMeteoritos() {
    for (const meteorito of meteoritos) {
        ctx.beginPath();
        ctx.arc(meteorito.x, meteorito.y, meteorito.radio, 0, Math.PI * 2);
        ctx.fillStyle = meteorito.color;
        ctx.fill();
        ctx.closePath();

        meteorito.y += meteorito.velocidadY;

        if (meteorito.y > canvas.height + meteorito.radio) {
            // Reaparecer en la parte superior con una nueva posición horizontal aleatoria
            meteorito.y = -meteorito.radio;
            meteorito.x = Math.random() * (canvas.width - meteorito.radio * 2) + meteorito.radio;
        }
    }
}

function dibujarCorazones() {
    for (const corazon of corazones) {
        ctx.beginPath();
        ctx.moveTo(corazon.x + corazon.radio, corazon.y);
        ctx.bezierCurveTo(
            corazon.x + corazon.radio,
            corazon.y - corazon.radio,
            corazon.x,
            corazon.y - corazon.radio * 1.5,
            corazon.x - corazon.radio,
            corazon.y
        );
        ctx.bezierCurveTo(
            corazon.x - corazon.radio * 2,
            corazon.y + corazon.radio * 0.5,
            corazon.x - corazon.radio * 2,
            corazon.y + corazon.radio * 1.5,
            corazon.x - corazon.radio,
            corazon.y + corazon.radio * 2
        );
        ctx.bezierCurveTo(
            corazon.x,
            corazon.y + corazon.radio * 1.5,
            corazon.x + corazon.radio,
            corazon.y + corazon.radio,
            corazon.x + corazon.radio,
            corazon.y
        );
        ctx.closePath();

        if (corazon.visible) {
            ctx.fillStyle = corazon.color;
            ctx.fill();
        }

        if (corazon.parpadeoVisible) {
            corazon.visible = !corazon.visible;
        }
        corazon.parpadeoVisible = !corazon.parpadeoVisible;

        corazon.y += corazon.velocidadY;

        if (corazon.y > canvas.height + corazon.radio) {
            corazon.y = -corazon.radio;
            corazon.x = Math.random() * canvas.width;
        }
    }
}

function dibujarDisparos() {
    for (const disparo of disparos) {
        ctx.beginPath();
        ctx.arc(disparo.x, disparo.y, disparo.radio, 0, Math.PI * 2);
        ctx.fillStyle = disparo.color;
        ctx.fill();
        ctx.closePath();

        disparo.y -= disparo.velocidad;

        // Comprobar colisión con meteoritos
        for (const meteorito of meteoritos) {
            const distanciaX = disparo.x - meteorito.x;
            const distanciaY = disparo.y - meteorito.y;
            const distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

            if (distancia < disparo.radio + meteorito.radio) {
                // Destruir meteorito y sumar puntos
                meteorito.y = -meteorito.radio;
                meteorito.x = Math.random() * canvas.width;

                jugador.puntos += 10;
            }
        }

        // Eliminar el disparo si sale de la pantalla
        if (disparo.y < -disparo.radio) {
            disparos.splice(disparos.indexOf(disparo), 1);
        }
    }
}

function dibujarCuadros() {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(cuadroLetras.x, cuadroLetras.y, cuadroLetras.ancho, cuadroLetras.alto);

    ctx.fillStyle = "#00FF00";
    ctx.fillRect(cuadroScore.x, cuadroScore.y, cuadroScore.ancho, cuadroScore.alto);

    ctx.fillStyle = "#0000FF";
    ctx.fillRect(cuadroVidas.x, cuadroVidas.y, cuadroVidas.ancho, cuadroVidas.alto);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("A", cuadroLetras.x + 40, cuadroLetras.y + 30);
    ctx.fillText("Score: " + jugador.puntos, cuadroScore.x + 10, cuadroScore.y + 30);
    ctx.fillText("Vidas: " + jugador.vidas, cuadroVidas.x + 10, cuadroVidas.y + 30);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "a" || event.key === "A") {
        jugador.x -= jugador.velocidad;
    } else if (event.key === "d" || event.key === "D") {
        jugador.x += jugador.velocidad;
    } else if (event.key === " " || event.key === "w") { // Disparar al presionar la tecla "W"
        const disparo = {
            x: jugador.x,
            y: jugador.y,
            radio: 5,
            velocidad: 5,
            color: "#FFA500"
        };
        disparos.push(disparo);
    }
});

function dibujarEscena() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    dibujarCuadros();
    dibujarJugador();
    dibujarMeteoritos();
    dibujarCorazones();
    dibujarDisparos();
    dibujarCorazon();

    if (!corazonCaido) {
        // Dibuja el corazón de Cupido en la posición inicial
        ctx.drawImage(gifImagen, jugador.x - 40, jugador.y - 150, 100, 90);

        // Actualiza la posición del corazón
        jugador.y += 2; // Ajusta la velocidad de caída como desees

        // Verifica si el corazón ha llegado a la parte inferior de la pantalla
        if (jugador.y >= canvas.height) {
            corazonCaido = true;
        }
    }

    requestAnimationFrame(dibujarEscena);
}

// Función para obtener colores aleatorios
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function iniciarJuego() {
    for (let i = 0; i < 5; i++) {
        const meteorito = {
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            radio: Math.random() * 20 + 10,
            velocidadY: Math.random() * 0.9 + 0.5,
            color: getRandomColor() // Usa la función getRandomColor() para obtener colores aleatorios
        };
        meteoritos.push(meteorito);
    }

    jugador.puntos = 0;

    // Llama a dibujarEscena para iniciar la animación
    dibujarEscena();
}

// Llama a iniciarJuego para comenzar el juego
iniciarJuego();



