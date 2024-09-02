const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = parseInt(prompt('Maximum life for you and monster.', '100'));

let chosenMaxLife = enteredValue;
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}

let currentMosterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

let battleLog = [];

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
    let logEntry;
    if (event === LOG_EVENT_PLAYER_ATTACK) {
        logEntry = {
            event: event,
            value: value,
            targer: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }
    else if (event === LOG_EVENT_MONSTER_ATTACK) {
        logEntry = {
            event: event,
            value: value,
            targer: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }
    else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: event,
            value: value,
            targer: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }
    else if (event === LOG_EVENT_PLAYER_HEAL) {
        logEntry = {
            event: event,
            value: value,
            targer: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }
    else if (event === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: event,
            value: value,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }

    battleLog.push(logEntry);

}

function reset() {
    currentMosterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;

    // if (mode === 'ATTACK') {
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // }
    // else if (mode === 'STRONG_ATTACK') {
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }

    damageDeal = dealMonsterDamage(maxDamage);
    currentMosterHealth -= damageDeal;
    writeToLog(logEvent, damageDeal, currentMosterHealth, currentPlayerHealth);
    endRound();
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMosterHealth, currentPlayerHealth);

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(currentPlayerHealth);
        alert("Bonus life used!")
    }

    if (currentMosterHealth <= 0 && currentPlayerHealth <= 0) {
        writeToLog(LOG_EVENT_GAME_OVER, 'DRAW', currentMosterHealth, currentPlayerHealth);
        alert('Draw !');
        reset();
    } else if (currentMosterHealth <= 0 && currentPlayerHealth > 0) {
        writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMosterHealth, currentPlayerHealth);
        alert('You Won!');
        reset();
    } else if (currentPlayerHealth <= 0 && currentMosterHealth > 0) {
        writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMosterHealth, currentPlayerHealth);
        alert('You Lose!');
        reset();
    }
}

function printLogHandler() {
    for (let i = 0; i < battleLog.length; i++) {
        console.log(`#${i} -----------------------`);
        for (const key in battleLog[i]) {
            console.log(`${key} : ${battleLog[i][key]}`);
        }
    }

    // battleLog.forEach(logEntry => {
    //     console.log('-----------------------');
    //     for (const key in logEntry) {
    //         console.log(`${key} : ${logEntry[key]}`);
    //     }
    // });

    // for (const log of battleLog) {
    //     console.log('-----------------------');
    //     console.log(log)
    // }
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;

    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal more than your max initial health");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }

    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMosterHealth, currentPlayerHealth);
    endRound();
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);

