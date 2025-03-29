class Omnitrix {
    constructor() {
        this.availableAliens = [];
        this.currentForm = null;
        this.cooldown = 0;
        this.maxCooldown = 10000; // 10 seconds in ms
        this.charge = 100;
        this.isActive = false;
        this.loadAliens();
    }

    async loadAliens() {
        try {
            const response = await fetch('../assets/aliens.json');
            this.availableAliens = await response.json();
            console.log('Aliens loaded successfully:', this.availableAliens);
        } catch (error) {
            console.error('Failed to load aliens:', error);
        }
    }

    transform(alienId) {
        if (this.cooldown > 0 || this.charge <= 0) return false;

        const selectedAlien = this.availableAliens.find(alien => alien.id === alienId);
        if (!selectedAlien) return false;

        this.currentForm = selectedAlien;
        this.cooldown = this.maxCooldown;
        this.charge -= 20; // Decrease charge with each transformation
        this.updateUI();
        return true;
    }

    revert() {
        this.currentForm = null;
    }

    update(deltaTime) {
        // Update cooldown timer
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime * 1000; // Convert to ms
        }

        // Recharge omnitrix when not in use
        if (!this.currentForm && this.charge < 100) {
            this.charge += deltaTime * 5; // 5% per second
            this.updateUI();
        }
    }

    updateUI() {
        // Update charge display
        const chargeBar = document.querySelector('.charge-fill');
        if (chargeBar) {
            chargeBar.style.width = `${this.charge}%`;
            chargeBar.style.backgroundColor = this.charge < 20 ? '#ff0000' : '#3b82f6';
        }

        // Update cooldown indicator
        const omnitrixIcon = document.querySelector('.omnitrix-icon');
        if (omnitrixIcon) {
            if (this.cooldown > 0) {
                omnitrixIcon.classList.add('animate-spin');
                omnitrixIcon.style.animationDuration = '1s';
            } else {
                omnitrixIcon.classList.remove('animate-spin');
            }
        }
    }

    toggleWheel() {
        const wheel = document.getElementById('omnitrix-wheel');
        if (wheel) {
            this.isActive = !this.isActive;
            wheel.classList.toggle('hidden');

            if (this.isActive) {
                this.populateWheel();
            }
        }
    }

    populateWheel() {
        const wheel = document.getElementById('omnitrix-wheel');
        if (!wheel) return;

        // Clear existing buttons
        wheel.querySelectorAll('.alien-btn').forEach(btn => btn.remove());

        // Create buttons for each available alien
        this.availableAliens.forEach((alien, index) => {
            const angle = (index / this.availableAliens.length) * 2 * Math.PI;
            const radius = 100;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const btn = document.createElement('button');
            btn.className = `alien-btn absolute w-12 h-12 rounded-full ${this.cooldown > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
            btn.style.backgroundColor = alien.color;
            btn.style.left = `calc(50% + ${x}px)`;
            btn.style.top = `calc(50% + ${y}px)`;
            btn.style.transform = 'translate(-50%, -50%)';
            btn.title = `${alien.name}: ${alien.description}`;
            btn.innerHTML = `<i class="fas fa-${alien.id === 'ghostfreak' ? 'ghost' : 'user-astronaut'}"></i>`;
            btn.onclick = () => this.transform(alien.id);

            wheel.querySelector('.relative').appendChild(btn);
        });
    }
}

export default Omnitrix;