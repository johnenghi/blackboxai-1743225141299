// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Game State
const gameState = {
    player: null,
    currentScene: null,
    lastTime: 0,
    deltaTime: 0,
    isPaused: false,
    combat: new CombatSystem()
};

// Initialize Game
function init() {
    const canvas = document.getElementById('game-canvas');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    const ctx = canvas.getContext('2d');

    // Initialize game systems
    initPlayer();
    initInput();
    initUI();

    // Start game loop
    gameLoop(performance.now());
}

// Game Loop
function gameLoop(timestamp) {
    gameState.deltaTime = (timestamp - gameState.lastTime) / 1000;
    gameState.lastTime = timestamp;

    if (!gameState.isPaused) {
        update(gameState.deltaTime);
        render();
    }

    requestAnimationFrame(gameLoop);
}

// Update game state
function update(deltaTime) {
    // Update game objects
    if (gameState.player) {
        gameState.player.update(deltaTime);
    }
    
    // Update combat system
    gameState.combat.update(deltaTime);
}

// Render game
function render() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game objects
    if (gameState.player) {
        gameState.player.render(ctx);
    }
    
    // Draw combat elements
    gameState.combat.render(ctx);
}

import Omnitrix from './omnitrix.js';
import CombatSystem from './combat.js';

// Initialize Player
function initPlayer() {
    gameState.player = {
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT / 2,
        width: 32,
        height: 32,
        baseSpeed: 200,
        baseHealth: 100,
        health: 100,
        omnitrix: new Omnitrix(),
        isTransformed: false,
        
        get speed() {
            return this.isTransformed ? 
                gameState.player.omnitrix.currentForm.speed : 
                this.baseSpeed;
        },
        
        get maxHealth() {
            return this.isTransformed ? 
                gameState.player.omnitrix.currentForm.health : 
                this.baseHealth;
        },

        update: function(deltaTime) {
            this.omnitrix.update(deltaTime);
            
            // Keep health within bounds
            this.health = Math.min(this.health, this.maxHealth);
        },

        render: function(ctx) {
            if (this.isTransformed) {
                const form = this.omnitrix.currentForm;
                ctx.fillStyle = form.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                
                // Draw alien name
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Orbitron';
                ctx.fillText(form.name, this.x, this.y - 5);
            } else {
                ctx.fillStyle = '#00ff00';
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        },

        transform: function(alienId) {
            if (this.omnitrix.transform(alienId)) {
                this.isTransformed = true;
                this.health = this.maxHealth;
                return true;
            }
            return false;
        },

        revert: function() {
            this.omnitrix.revert();
            this.isTransformed = false;
            this.health = this.baseHealth;
        }
    };
}

// Initialize Input System
function initInput() {
    document.addEventListener('keydown', (e) => {
        if (gameState.isPaused) return;

        switch(e.key) {
            case 'ArrowUp':
                gameState.player.y -= gameState.player.speed * gameState.deltaTime;
                break;
            case 'ArrowDown':
                gameState.player.y += gameState.player.speed * gameState.deltaTime;
                break;
            case 'ArrowLeft':
                gameState.player.x -= gameState.player.speed * gameState.deltaTime;
                break;
            case 'ArrowRight':
                gameState.player.x += gameState.player.speed * gameState.deltaTime;
                break;
            case ' ':
                // Space bar for action
                if (gameState.combat.currentEnemy) {
                    if (gameState.player.isTransformed) {
                        // Use alien ability
                        gameState.combat.attack(
                            gameState.player, 
                            gameState.player.omnitrix.currentForm.abilities[0]
                        );
                    } else {
                        // Normal attack
                        gameState.combat.attack(gameState.player, 'punch');
                    }
                }
                break;
            case 't':
                // Toggle Omnitrix wheel
                gameState.player.omnitrix.toggleWheel();
                break;
            case 'r':
                // Revert transformation
                if (gameState.player.isTransformed) {
                    gameState.player.revert();
                }
                break;
            case 'Escape':
                gameState.isPaused = !gameState.isPaused;
                break;
        }
    });
}

// Initialize UI System
function initUI() {
    // Health bar updates
    const updateHealthBar = () => {
        const healthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
        document.querySelector('.health-fill').style.width = `${healthPercent}%`;
    };

    // Initial UI setup
    updateHealthBar();
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);