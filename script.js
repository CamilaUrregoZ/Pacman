document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    const cells = Array.from(grid.querySelectorAll('div'));
    const width = 15;
    const height = 10;
    let pacmanIndex = 16; 
    let Puntaje = 0;
    const puntajeDisplay = document.getElementById('Puntaje');  
    cells[pacmanIndex].classList.add('pacman'); // Coloca a Pac-Man en la posición inicial

    // Función para mover Pac-Man
    function movePacman(e) {
        cells[pacmanIndex].classList.remove('pacman'); // Elimina la clase de Pac-Man de la celda actual

        // Movimientos
        switch (e.key) {
            case 'ArrowUp':
                if (pacmanIndex - width >= 0 && !cells[pacmanIndex - width].classList.contains('wall')) {
                    pacmanIndex -= width; // ARRIBA
                }
                break;
            case 'ArrowDown':
                if (pacmanIndex + width < cells.length && !cells[pacmanIndex + width].classList.contains('wall')) {
                    pacmanIndex += width; // ABAJO
                }
                break;
            case 'ArrowLeft':
                if (pacmanIndex % width !== 0 && !cells[pacmanIndex - 1].classList.contains('wall')) {
                    pacmanIndex -= 1; // IZQUIERDA
                }
                break;
            case 'ArrowRight':
                if (pacmanIndex % width !== width - 1 && !cells[pacmanIndex + 1].classList.contains('wall')) {
                    pacmanIndex += 1; // DERECHA
                }
                break;
        }

        // Comida - Puntos blancos
        if (cells[pacmanIndex].classList.contains('dot')) {
            cells[pacmanIndex].classList.remove('dot'); // Elimina el punto de comida
            Puntaje += 10; // Aumenta el puntaje en 10
            puntajeDisplay.textContent = `Puntaje: ${Puntaje}`;  //Muestra el puntaje

        }

        cells[pacmanIndex].classList.add('pacman'); // Coloca Pac-Man en la nueva celda

    }

    
    document.addEventListener('keydown', movePacman);
    

    // Clase para los fantasmas
    class Ghost {
        constructor(name, startIndex, className, speed = 500) {
            this.name = name;
            this.currentIndex = startIndex;
            this.className = className;
            this.speed = speed;
            this.timerId = null;
            this.directions = [-1, 1, -width, width]; // Arriba, abajo, izquierda, derecha
        }

        draw() {
            cells[this.currentIndex].classList.add('ghost', this.className);
        }

        erase() {
            cells[this.currentIndex].classList.remove('ghost', this.className);
        }

        move() {
            const moveGhost = () => {
                const direction = this.directions[Math.floor(Math.random() * this.directions.length)];
                const nextIndex = this.currentIndex + direction;
                if (
                    !cells[nextIndex].classList.contains('wall') &&
                    !cells[nextIndex].classList.contains('ghost')
                ) {
                    this.erase();
                    this.currentIndex = nextIndex;
                    this.draw();
                } else {
                    moveGhost();
                }
            };

            this.timerId = setInterval(moveGhost, this.speed);
        }
    }

    const blinky = new Ghost("blinky", 50, 'blue', 350);
    const pinky = new Ghost("pinky", 67, 'pink', 450);
    const ghosts = [blinky, pinky];

    ghosts.forEach(ghost => {
        ghost.draw();
        ghost.move();
    });
    
});