const readline = require('readline'); 

const rl = readline.createInterface({input: process.stdin, output: process.stdout})

//individual monopoke class
class Monpoke {
  constructor(monpokeId, healthPoints, attackPoints) {
    this.monpokeId = monpokeId,
    this.healthPoints = healthPoints,
    this.attackPoints = attackPoints
  }

  defend(attacker) {
    this.healthPoints -= attacker.attackPoints;
    console.log(`${attacker.monpokeId} attacked ${this.monpokeId} for ${attacker.attackPoints} damage!`);
  }
}

//team class
class MonpokeTeam {
  constructor(teamId) {
    this.teamId = teamId,
    this.monpoke = [],
    this.chosenMonpoke = {}
  }

  addMonpoke(monpokeId, healthPoints, attackPoints) {
    let newMonpoke = new Monpoke(monpokeId, healthPoints, attackPoints);
    this.monpoke.push(newMonpoke);
  }

  chooseMonpoke(monpokeId) {
    this.chosenMonpoke = this.monpoke.filter(monpoke => monpoke.monpokeId = monpokeId);
  }
}

//game class
class MonpokeGame {
  constructor() {
    this.team1 = {},
    this.team2 = {},
    this.team1Turn = true
  }

  addTeam(teamId, monpokeId, healthPoints, attackPoints) {
    if (!this.team1.teamId) {
      this.team1 = new MonpokeTeam(teamId);
      this.team1.addMonpoke(monpokeId, healthPoints, attackPoints);
      return true;
    } else if (!this.team2.teamId) {
      this.team2 = new MonpokeTeam(teamId);
      this.team2.addMonpoke(monpokeId, healthPoints, attackPoints);
      return true;
    } else {
      console.log('You have already populated the game!');
      return false;
    }
  }

  completeTurn() {
    this.team1Turn = !this.team1Turn;
  }

  teamsInitialized() {
    if (this.team1.monpoke.length && this.team2.monpoke.length) {
      return true;
    }
    console.log('Please add two teams before initiating gameplay!');
    return false; 
  }

  currTeam() {
    let currTeam = this.team2; 
    let otherTeam = this.team1; 
    if (this.team1Turn) {
      currTeam = this.team1;
      otherTeam = this.team2;
    }
    return [currTeam, otherTeam];
  }

  checkMonpokeInSet(monpokeId) {
    let currTeam = this.currTeam()[0]
    let currMonpoke = currTeam.monpoke.filter(monpoke => monpoke.monpokeId === monpokeId)[0] || {}; 
    if (!currMonpoke.monpokeId) {
      console.log(`${currTeam.teamId} does not have the Monpoke ${currMonpoke.monopokeId}`);
    }
    return currMonpoke; 
  }

  checkMonopokeSelected(monopokeId) {
    let currTeam = game.currTeam()[0]; 
    let selected = true;
    if (!currTeam.chosenMonpoke.monpokeId) {
      console.log('Please choose a Monopoke before using the attack command!');
      selected = false;
    } else if (currTeam.chosenMonpoke.monpokeId !== monopokeId) {
      console.log(`You can only attack with your chosen Monopoke! Please either attack with your current Monopoke or use this turn to switch your chosen Monopoke to ${monopoke.id}`);
      selected = false;
    }
    return selected;
  }

  checkTeamStatus(loser, winner) {
    if (!loser.monpoke.length) {
      console.log(`Team ${winner.teamId} wins!`)
      console.log('Play again!')
      game = new MonpokeGame()
    }
  }
}

//game command helper functions
let create = (teamId, monpokeId, healthPoints, attackPoints) => {
  if (!teamId || !monpokeId || !healthPoints || !attackPoints) {
    console.log('Please define all of the parameters for the create action!')
    return
  }
  let team = game.addTeam(teamId, monpokeId, healthPoints, attackPoints);
  if (team) {
    console.log(`${monpokeId} has been assigned to team ${teamId}!`);
  } 
}

let choose = (monpokeId) => {
  let team = game.currTeam()[0];
  team.chosenMonpoke = game.checkMonpokeInSet(monpokeId);
  if (!team.chosenMonpoke.monpokeId) {
    return false;
  }
  console.log(`${monpokeId} enters the battle!`);
  game.completeTurn();
  return true;
}

let attack = (monopokeId) => {
  let [attacker, defender] = game.currTeam();
  if (game.checkMonopokeSelected(monopokeId)) {
    defender.chosenMonpoke.defend(attacker.chosenMonpoke);
    if (defender.chosenMonpoke.healthPoints <= 0) {
      console.log(`${defender.chosenMonpoke.monpokeId} has been defeated!`);
      defender.monpoke = defender.monpoke.filter(monpoke => monpoke.monpokeId !== defender.chosenMonpoke.monpokeId);
      game.checkTeamStatus(defender, attacker); 
    }
    game.completeTurn();
  }
}

//create a new game
let game = new MonpokeGame();

//terminal interface, readline
rl.on('line', (input) => {
  let command = input.split(' ');
  if(command[0] === 'CREATE') {
    create(command[1], command[2], command[3], command[4]);
  } else if (game.teamsInitialized()) {
    if (command[1] === 'ICHOOSEYOU') {
      choose(command[0]);
    } else if (command[1] === 'ATTACK') {
      attack(command[0]);
    } else {
      console.log('Invalid input!');
    }
  }
})

module.exports = MonpokeGame