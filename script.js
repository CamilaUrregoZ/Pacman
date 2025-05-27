document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    const cells = Array.from(grid.querySelectorAll('div'));
    const width = 15;
    let pacmanIndex = 16; // posición inicial del pacman
    let score = 0;
    let powerMode = false;
    let powerModeTimeout;

    cells[pacmanIndex].classList.add("pacman");

    const scoreDisplay = document.createElement('h2');
    scoreDisplay.textContent = `Puntaje: ${score}`;
    document.body.insertBefore(scoreDisplay, grid);
class Ghost {
    constructor(name, startIndex, className, speed = 500) {
        this.name = name;
        this.startIndex = startIndex;
        this.currentIndex = startIndex;
        this.className = className;
        this.speed = speed;
        this.timerId = null;
        this.directions = [-1, 1, -width, width];
        this.isVulnerable = false; // nuevo estado
    }

    draw() {
        const ghostCell = cells[this.currentIndex];
        ghostCell.classList.add("ghost", this.className);
        if (this.isVulnerable) {
            ghostCell.classList.add("vulnerable");
        }
    }

    erase() {
        const ghostCell = cells[this.currentIndex];
        ghostCell.classList.remove("ghost", this.className, "vulnerable");
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

                // Fantasma choca con PacMan
                if (this.currentIndex === pacmanIndex) {
                    if (this.isVulnerable) {
                        // Fantasma comido
                        score += 10;
                        scoreDisplay.textContent = `Puntaje: ${score}`;
                        this.erase();
                        this.currentIndex = this.startIndex;
                        this.draw();
                    } else {
                        gameOver();
                    }
                }
            }
        };

        this.timerId = setInterval(moveGhost, this.speed);
    }
}


    // Dibujar PacMan con dirección (opcional)
    function drawPacman(direction) {
        cells[pacmanIndex].classList.add('pacman', direction);
    }

    function erasePacman() {
        cells[pacmanIndex].classList.remove('pacman', 'left', 'right', 'up', 'down');
    }

    // Función para comer puntos
    function eatDot() {
        if (cells[pacmanIndex].classList.contains('dot')) {
            cells[pacmanIndex].classList.remove('dot');
            score++;
            scoreDisplay.textContent = `Puntaje: ${score}`;
            checkWin();
        }
    }

    // Función para comer power pellets y activar modo poder
    function eatPowerPellet() {
        if (cells[pacmanIndex].classList.contains('power-pellet')) {
            cells[pacmanIndex].classList.remove('power-pellet');
            activatePowerMode();
        }
    }

function activatePowerMode() {
    powerMode = true;
    document.body.classList.add("power-mode");

    // Poner a todos los fantasmas vulnerables
    ghosts.forEach(ghost => {
        ghost.isVulnerable = true;
        ghost.draw();  // para que se actualice visualmente
    });

    clearTimeout(powerModeTimeout);
    powerModeTimeout = setTimeout(() => {
        powerMode = false;
        document.body.classList.remove("power-mode");

        // Quitar vulnerabilidad a los fantasmas
        ghosts.forEach(ghost => {
            ghost.isVulnerable = false;
            ghost.draw();
        });
    }, 5000); // 5 segundos de poder
}

    // Movimiento de PacMan con detección de fantasmas
    function movePacman(e) {
        let newPacmanIndex = pacmanIndex;
        let direction = '';

        switch (e.key) {
            case 'ArrowLeft':
                if (pacmanIndex % width !== 0) {
                    newPacmanIndex = pacmanIndex - 1;
                    direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (pacmanIndex % width !== width - 1) {
                    newPacmanIndex = pacmanIndex + 1;
                    direction = 'right';
                }
                break;
            case 'ArrowUp':
                if (pacmanIndex - width >= 0) {
                    newPacmanIndex = pacmanIndex - width;
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (pacmanIndex + width < cells.length) {
                    newPacmanIndex = pacmanIndex + width;
                    direction = 'down';
                }
                break;
        }

        if (!cells[newPacmanIndex].classList.contains('wall')) {
            erasePacman();
            pacmanIndex = newPacmanIndex;

            // Comer punto normal
            eatDot();

            // Comer power pellet
            eatPowerPellet();

            // Interacción con fantasmas
            if (cells[pacmanIndex].classList.contains('ghost')) {
                if (powerMode) {
                    // PacMan come al fantasma -> gana puntos, fantasma vuelve a inicio
                    score += 10;
                    scoreDisplay.textContent = `Puntaje: ${score}`;
                    const ghost = ghosts.find(g => g.currentIndex === pacmanIndex);
                    if (ghost) {
                        ghost.erase();
                        ghost.currentIndex = ghost.startIndex;
                        ghost.draw();
                    }
                } else {
                    // PacMan pierde
                    gameOver();
                    return;
                }
            }

            drawPacman(direction);
        }
        if (cells[pacmanIndex].classList.contains('ghost')) {
    const ghost = ghosts.find(g => g.currentIndex === pacmanIndex);
    if (ghost.isVulnerable) {
        score += 10;
        scoreDisplay.textContent = `Puntaje: ${score}`;
        ghost.erase();
        ghost.currentIndex = ghost.startIndex;
        ghost.draw();
    } else {
        gameOver();
        return;
    }
}

    }

    // Comprobar si quedan puntos para ganar
    function checkWin() {
        const remainingDots = cells.some(cell => cell.classList.contains('dot') || cell.classList.contains('power-pellet'));
        if (!remainingDots) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId));
            document.removeEventListener('keydown', movePacman);
            scoreDisplay.textContent += " - ¡GANASTE! 🎉";
        }
    }

    // Fantasmas

    function gameOver() {
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener('keydown', movePacman);
        scoreDisplay.textContent += " - GAME OVER 💀";
    }

    // Inicializar fantasmas
    const blinky = new Ghost("blinky", 40, 'red', 500);
    const pinky = new Ghost("pinky", 67, 'pink', 600);
    const ghosts = [blinky, pinky];

    ghosts.forEach(ghost => {
        ghost.draw();
        ghost.move();
    });

    document.addEventListener('keydown', movePacman);
    drawPacman();
});
