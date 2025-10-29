document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('background-music');
    const duckPond = document.getElementById('duck-pond');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const mainQuestion = document.getElementById('main-question');
    const buttonsContainer = document.querySelector('.buttons-container');

    // --- Control de Música (Importante para que suene automáticamente) ---
    // Algunos navegadores bloquean el autoplay si no hay interacción previa.
    // Esto intenta reproducirla tan pronto como sea posible.
    backgroundMusic.volume = 0.4; // Ajusta el volumen (0.0 a 1.0)
    backgroundMusic.play().catch(error => {
        console.log("Música no pudo reproducirse automáticamente:", error);
        // Si no se reproduce, podemos poner un pequeño botón de "Play"
        // o simplemente esperar a que el usuario interactúe con la página.
    });


    // --- Generación de Patitos ---
    const duckImageSrc = 'imagenes/Breakdance-_1_.gif'; // Cambia esto a la ruta de tu patito.
    const numDucks = 8; // Número de patitos que quieres
    const duckSize = 60; // Tamaño de cada patito en px

    function createDuck() {
        const duck = document.createElement('img');
        duck.src = duckImageSrc;
        duck.classList.add('duck'); // Añade la clase 'duck' para el CSS

        // Posición inicial aleatoria en la parte inferior o lateral
        let startX, startY;
        const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

        if (edge === 0) { // Top
            startX = Math.random() * window.innerWidth;
            startY = -duckSize;
        } else if (edge === 1) { // Right
            startX = window.innerWidth;
            startY = Math.random() * window.innerHeight;
        } else if (edge === 2) { // Bottom
            startX = Math.random() * window.innerWidth;
            startY = window.innerHeight;
        } else { // Left
            startX = -duckSize;
            startY = Math.random() * window.innerHeight;
        }

        duck.style.left = `${startX}px`;
        duck.style.top = `${startY}px`;
        duck.style.width = `${duckSize}px`;
        duck.style.position = 'absolute'; // Asegura que se posicionen correctamente

        duckPond.appendChild(duck);

        // Movimiento del patito
        animateDuck(duck, startX, startY);
    }

    function animateDuck(duck, startX, startY) {
        // Un punto final aleatorio dentro de la pantalla
        const endX = Math.random() * (window.innerWidth - duckSize);
        const endY = Math.random() * (window.innerHeight - duckSize);

        // Duración del viaje (más largo el número, más lento el pato)
        const duration = (Math.random() * 20 + 10) * 1000; // Entre 10 y 30 segundos

        // Rotar el pato para que "mire" hacia donde va
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        duck.style.transform = `rotate(${angle}deg)`;

        duck.animate([
            { left: `${startX}px`, top: `${startY}px` },
            { left: `${endX}px`, top: `${endY}px` }
        ], {
            duration: duration,
            easing: 'linear',
            fill: 'forwards' // Mantiene al pato en su posición final
        }).onfinish = () => {
            // Cuando un pato termina de moverse, lo reposicionamos y lo animamos de nuevo
            duck.remove(); // Quitamos el pato actual
            createDuck(); // Creamos uno nuevo para un movimiento infinito
        };
    }

    // Crear los patitos iniciales
    for (let i = 0; i < numDucks; i++) {
        setTimeout(createDuck, i * 1500); // Aparecen escalonadamente
    }


    // --- Lógica de los Botones ---

    // Botón "Sí"
    yesButton.addEventListener('click', () => {
        backgroundMusic.play();
        mainQuestion.textContent = 'Yeeepeee, te quiero muchooo ❤️';
        buttonsContainer.innerHTML = ''; // Quita los botones
        backgroundMusic.volume = 0.6; // Sube un poco el volumen
        
        // Opcional: Puedes añadir confetti o alguna otra animación
        // Aquí podríamos detener los patitos y mostrar una animación de corazón grande
        // o algo más festivo.

        // Ejemplo simple: un mensaje adicional
        const yayMessage = document.createElement('p');
        yayMessage.textContent = '🎉 Es el inicio de algo nuevo y hermoso 🎉';
        yayMessage.style.fontSize = '24px';
        yayMessage.style.color = '#d6336c';
        yayMessage.style.marginTop = '20px';
        buttonsContainer.appendChild(yayMessage);

        // Opcional: redirigir a otra página o mostrar una imagen final
        // setTimeout(() => { window.location.href = 'felices.html'; }, 5000);
    });

    // Botón "No" (el botón "No" se mueve para evitar el clic)
    noButton.addEventListener('mouseover', () => {
        // Solo si la pregunta principal aún es la original, se mueve el botón
        if (mainQuestion.textContent === '¿Franco quieres pololear conmigo?') {
            const noButtonRect = noButton.getBoundingClientRect();
            const containerRect = buttonsContainer.getBoundingClientRect();

            // Calcular nuevas posiciones aleatorias dentro del contenedor principal
            // Asegurarse de que no se salga de los límites del body
            let newX = Math.random() * (window.innerWidth - noButtonRect.width);
            let newY = Math.random() * (window.innerHeight - noButtonRect.height);

            // Asegurarse de que no esté cerca del botón "Sí"
            const yesButtonRect = yesButton.getBoundingClientRect();
            const minDistance = 150; // Distancia mínima para que no se superpongan

            // Pequeño bucle para asegurar que no esté demasiado cerca
            let attempts = 0;
            while (
                (Math.abs(newX - yesButtonRect.left) < minDistance && Math.abs(newY - yesButtonRect.top) < minDistance) ||
                (newX + noButtonRect.width > window.innerWidth) ||
                (newY + noButtonRect.height > window.innerHeight) ||
                (newX < 0) || (newY < 0)
                && attempts < 50 // Para evitar bucles infinitos
            ) {
                newX = Math.random() * (window.innerWidth - noButtonRect.width);
                newY = Math.random() * (window.innerHeight - noButtonRect.height);
                attempts++;
            }
            
            // Aplicar las nuevas posiciones al botón "No"
            noButton.style.position = 'absolute'; // Necesario para que top/left funcionen
            noButton.style.left = `${newX}px`;
            noButton.style.top = `${newY}px`;
            noButton.style.zIndex = '9999'; // Asegura que esté por encima de otros elementos
        }
    });

    // También puedes añadir un mensaje divertido si insiste en hacer clic en "No"
    noButton.addEventListener('click', () => {
        if (mainQuestion.textContent === '¿Quieres pololear conmigo?') {
            mainQuestion.textContent = '¡No puedes decir que No! Inténtalo de nuevo. 😉';
            // Aquí puedes hacer que el botón "No" sea temporalmente inactivo
            // o que al hacer click, se mueva aún más rápido.
        } else {
             // Si el mensaje ya cambió, quizás quieras que no haga nada o un mensaje diferente
             mainQuestion.textContent = '¡No hay salida! ¡Solo hay una respuesta correcta! 😂';
        }
    });
});