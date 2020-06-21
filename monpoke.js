const readline = require('readline'); 

const rl = readline.createInterface({input: process.stdin, output: process.stdout})

//individual monpoke class
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
    if (typeof(healthPoints) !== 'number' || typeof(attackPoints) !== 'number') {
      console.log('Health and attack points must be numbers!')
    } else {
      let newMonpoke = new Monpoke(monpokeId, healthPoints, attackPoints);
      this.monpoke.push(newMonpoke);
    }
  }

  chooseMonpoke(monpokeId) {
    this.chosenMonpoke = this.monpoke.filter(monpoke => monpoke.monpokeId === monpokeId);
  }
}

//game class
class MonpokeGame {
  constructor() {
    this.team1 = {},
    this.team2 = {},
    this.team1Turn = true,
    this.gameOver = false
  }

  addTeam(teamId, monpokeId, healthPoints, attackPoints) {
    if (!teamId || !monpokeId || !healthPoints || !attackPoints) {
      console.log('Please define all of the parameters for the create action!');
      return false;
    }
    if (!this.team1.teamId) {
      this.team1 = new MonpokeTeam(teamId + '');
      this.team1.addMonpoke(monpokeId + '', healthPoints, attackPoints);
    } else if (!this.team2.teamId) {
      if (teamId === this.team1.teamId) {
        console.log('Team id must be unique!');
        return false;
      }
      this.team2 = new MonpokeTeam(teamId + '');
      this.team2.addMonpoke(monpokeId + '', healthPoints, attackPoints);
    } else {
      console.log('You have already populated the game!');
      return false;
    }
    console.log(`${monpokeId} has been assigned to team ${teamId}!`);
    return true;
  }

  completeTurn() {
    this.team1Turn = !this.team1Turn;
  }

  teamsInitialized() {
    if (this.team1.monpoke && this.team2.monpoke) {
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
      console.log(`${currTeam.teamId} does not have the Monpoke ${monpokeId}`);
    }
    return currMonpoke; 
  }

  checkMonpokeSelected(monpokeId) {
    let currTeam = this.currTeam()[0];
    let selected = true;
    if (!currTeam.chosenMonpoke.monpokeId) {
      console.log('Please choose a Monpoke before using the attack command!');
      selected = false;
    } else if (currTeam.chosenMonpoke.monpokeId !== monpokeId) {
      console.log(`You can only attack with your chosen Monpoke! Please either attack with your current Monpoke or use this turn to switch your chosen Monpoke to ${monpokeId}`);
      selected = false;
    }
    return selected;
  }

  checkTeamStatus(loser, winner) {
    if (!loser.monpoke.length) {
      this.gameOver = true;
      console.log(`Team ${winner.teamId} wins!`);
      console.log('Play again :)');
      game = new MonpokeGame();
    }
  }

  choose(monpokeId) {
    let team = this.currTeam()[0]; 
    team.chosenMonpoke = this.checkMonpokeInSet(monpokeId);
    if (!team.chosenMonpoke.monpokeId) {
      return false;
    }
    console.log(`${monpokeId} enters the battle!`);
    this.completeTurn();
    return true;
  }
  
  attack(monpokeId) {
    let [attacker, defender] = this.currTeam();
    if (this.checkMonpokeSelected(monpokeId)) {
      defender.chosenMonpoke.defend(attacker.chosenMonpoke);
      if (defender.chosenMonpoke.healthPoints <= 0) {
        console.log(`${defender.chosenMonpoke.monpokeId} has been defeated!`);
        defender.monpoke = defender.monpoke.filter(monpoke => monpoke.monpokeId !== defender.chosenMonpoke.monpokeId);
        defender.chosenMonpoke = {};
        this.checkTeamStatus(defender, attacker); 
      }
      this.completeTurn();
    }
  }
}

//create a new game
let game = new MonpokeGame();

//terminal interface, readline
rl.on('line', (input) => {
  let command = input.split(' ');
  if(command[0] === 'CREATE') {
    game.addTeam(command[1], command[2], Number(command[3]), Number(command[4]));
  } else if (game.teamsInitialized()) {
    if (command[1] === 'ICHOOSEYOU') {
      game.choose(command[0]);
    } else if (command[1] === 'ATTACK') {
      game.attack(command[0]);
    } else {
      console.log('Invalid input!');
    }
  }
})

module.exports = MonpokeGame