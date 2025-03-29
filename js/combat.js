class CombatSystem {
    constructor() {
        this.enemies = [];
        this.currentEnemy = null;
    }

    spawnEnemy(enemyData) {
        const enemy = {
            id: enemyData.id,
            health: enemyData.health,
            attack: enemyData.attack,
            speed: enemyData.speed,
            abilities: enemyData.abilities,
            update: function(deltaTime) {
                // Enemy update logic (AI behavior)
            },
            render: function(ctx) {
                ctx.fillStyle = '#ff0000'; // Enemy color
                ctx.fillRect(100, 100, 32, 32); // Placeholder position
            }
        };
        this.enemies.push(enemy);
        this.currentEnemy = enemy; // Set the current enemy for combat
    }

    attack(player, ability) {
        if (this.currentEnemy) {
            const damage = this.calculateDamage(player, this.currentEnemy, ability);
            this.currentEnemy.health -= damage;
            console.log(`Player attacked ${this.currentEnemy.id} for ${damage} damage!`);
            if (this.currentEnemy.health <= 0) {
                this.defeatEnemy(this.currentEnemy);
            }
        }
    }

    calculateDamage(attacker, defender, ability) {
        // Basic damage calculation logic
        const baseDamage = attacker.attack; // Use player's attack value
        return baseDamage; // Simplified for now
    }

    defeatEnemy(enemy) {
        console.log(`${enemy.id} has been defeated!`);
        this.enemies = this.enemies.filter(e => e !== enemy);
        this.currentEnemy = null; // Reset current enemy
    }

    update(deltaTime) {
        this.enemies.forEach(enemy => enemy.update(deltaTime));
    }

    render(ctx) {
        this.enemies.forEach(enemy => enemy.render(ctx));
    }
}

export default CombatSystem;