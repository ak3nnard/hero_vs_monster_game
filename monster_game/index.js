
const characterData = {
    hero: {
        name: "Wizard",
        avatar: "wizard.png",
        health: 60,
        diceCount: 3,
        currentDiceScore: []
    },   
    orc: {
        name: "Orc",
        avatar: "orc.png",
        health: 30,
        diceCount: 1,
        currentDiceScore: []
    },
    demon: {
        name: "Demon",
        avatar: "demon.png",
        health: 25,
        diceCount: 2,
        currentDiceScore: []
    },
    goblin: {
        name: "Goblin",
        avatar: "goblin.png",
        health: 20,
        diceCount: 3,
        currentDiceScore: []
    }
}

let monstersArray = ["orc", "demon", "goblin"];
let isWaiting = false;

const getPercentage = (remainingHealth, maximumHealth) =>
    (100 * remainingHealth / maximumHealth)

function getDiceRollArray(diceCount) {
    return new Array(diceCount).fill(0).map(() => 
    Math.floor(Math.random() * 6) + 1
    )  
}

// Object.assign: copies properties from sourse obj to target obj
// returns new version of the target obj
class Character {
    constructor(data) {
        Object.assign(this, data)               
        this.maxHealth = this.health       
        this.diceHtml = getDicePlaceholderHtml(this.diceCount)
        //updates currentDiceScore w. values returned by getDiceRollArray
    }

    setDiceHtml() {
        this.currentDiceScore = getDiceRollArray(this.diceCount)
        this.diceHtml = this.currentDiceScore.map((num) =>
            `<div class="dice">${num}</div>`).join("")
    }

    takeDamage(attackScoreArray) {
        const totalAttackScore = attackScoreArray.reduce((total, num) => total + num) //used .reduce() to reduce atackScoreArray to single number

        this.health -= totalAttackScore // decrement health when attacked
        if (this.health <= 0) {
            this.dead = true
            this.health = 0
        } 
    }

    getHealthBarHtml() {
        const percent = getPercentage(this.health, this.maxHealth)
        return `
        <div class="health-bar-outer">
            <div class="health-bar-inner ${percent < 26 ? "danger" : "" }" 
            style="width: ${percent}%;">
            </div>
        </div>`
    }

    getCharacterHtml() {
        const { elementId, name, avatar, health, diceCount, diceHtml } = this;      
        const healthBar = this.getHealthBarHtml()
           return `
            <div class="character-card">
                <h4 class="name"> ${name} </h4>
                <img class="avatar" src="${avatar}" />
                <div class="health">health: <b> ${health} </b></div>
                ${healthBar}
                <div class="dice-container">
                    ${diceHtml}
                </div>
            </div>`;
    } 
}

function getDicePlaceholderHtml(diceCount){
    return new Array(diceCount).fill(0).map(() =>
    `<div class="placeholder-dice"></div>`
    ).join("") //get rid of commas
}

function getNewMonster() {
    const nextMonsterData = characterData[monstersArray.shift()]
    return nextMonsterData ? new Character(nextMonsterData) : {}
}

function attack() {
    if(!isWaiting){
        wizard.setDiceHtml()
        monster.setDiceHtml()
        wizard.takeDamage(monster.currentDiceScore)
        monster.takeDamage(wizard.currentDiceScore)
        render()            // renders wizard/orc from getdicehtml
        
        if(wizard.dead) {
            endGame()
        } 
        else if(monster.dead) {
            isWaiting = true
            if (monstersArray.length > 0) {
                setTimeout(()=>{
                    monster = getNewMonster()
                    render()
                    isWaiting = false
                },1500)
            }
            else{
                endGame()
            }
        }
    }
}

function endGame() {
    isWaiting = true
    const endMessage = wizard.health === 0 && monster.health === 0 ? 
        "No victors - all creatures are dead!" :
    wizard.health > 0 ? "The Wizard Wins!" : 
        "The monsters are Victorious!"
    setTimeout(()=>{
        document.body.innerHTML = 
            `<div class="end-game">
                <h2>Game Over</h2>
                <h3>${endMessage}</h3>
            </div>` 
    }, 1500)
}

document.getElementById('attack-button').addEventListener('click', attack)

const wizard = new Character(characterData.hero)
let monster = getNewMonster()

function render(){
document.getElementById('hero').innerHTML = wizard.getCharacterHtml()
document.getElementById('monster').innerHTML = monster.getCharacterHtml()
}
render()

/*****************NOTES***************/
/* 
ARROW FUNCTIONS
- if you have one param, dont need brackets
- if you have zero or two+ params, do need brackets
- can return one line of code w/o curly braces or return keyword
- more complex logic requires curly braces/return keyword

ternary operator
t or f?                 execute if false
condition ? expression : expression
       execute if true
*/