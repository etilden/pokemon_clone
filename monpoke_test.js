// const { expect } = require('chai')
const { assert } = require('chai')
const  MonpokeGame = require('./monpoke')
const MonpokeTeam = require('./monpoke')

describe('Monpoke Game Class', () => {
  let game; 
  beforeEach(() => {
    game = new MonpokeGame(); 
  }); 

  it('adds a single team with the .addTeam() method, starting with team1', () => {
    game.addTeam('Team1', 'Monpoke1', 1, 1);
    assert.equal(game.team1.teamId, 'Team1');
  })

  it('adds two teams without overwriting the first team name', () => {
    game.addTeam('Team1', 'Monpoke1', 1, 1);
    game.addTeam('Team2', 'Monpoke2', 2, 2);
    assert.equal(game.team1.teamId, 'Team1');
    assert.equal(game.team2.teamId, 'Team2');
  })

  it ('does not add more than two teams or overwrite teams when three are added', () => {
    game.addTeam('Team1', 'Monpoke1', 1, 1);
    game.addTeam('Team2', 'Monpoke2', 2, 2);
    game.addTeam('Team3', 'Monpoke3', 3, 3);
    assert.equal(game.team1.teamId, 'Team1');
    assert.equal(game.team2.teamId, 'Team2');
  })

  it ('choose method should assign a team\'s monpoke', () => {
    game.addTeam('Team1', 'Monpoke1', 1, 1);
    game.addTeam('Team2', 'Monpoke2', 2, 2);
    game.choose('Monpoke1');
    assert.equal(game.team1.chosenMonpoke.monpokeId, 'Monpoke1');
  })

  it('choose method should only assign monpoke that are within that team\'s set of valid monpoke', () => {
    game.addTeam('Team1', 'Monpoke1', 1, 1);
    game.addTeam('Team2', 'Monpoke2', 2, 2);
    game.choose('DillPickle');
    assert.isUndefined(game.team1.chosenMonpoke.monpokeId);
  })

  it('choosing a monpoke should cause current team to switch (ending turn)', () => {
    game.addTeam('Team1', 'Monpoke1', 1, 1);
    game.addTeam('Team2', 'Monpoke2', 2, 2);
    game.choose('Monpoke1');
    assert.isFalse(game.team1Turn);
  }) 

  it('attacking should decrement the health points of the defending team\'s chosen monpoke by the attack points of the attacking team\'s chosen monpoke', () => {
    game.addTeam('Team1', 'Monpoke1', 1, 1);
    game.addTeam('Team2', 'Monpoke2', 2, 2);
    game.choose('Monpoke1');
    game.choose('Monpoke2');
    game.attack('Monpoke1');
    assert.equal(game.team2.chosenMonpoke.healthPoints, 1);
  })
  
  it('the completion of an attack should end the turn', () => {
    game.addTeam('Team1', 'Monpoke1', 1, 1);
    game.addTeam('Team2', 'Monpoke2', 2, 2);
    game.choose('Monpoke1');
    game.choose('Monpoke2');
    game.attack('Monpoke1');
    assert.isFalse(game.team1Turn);
  })

  it('a monpoke should be removed from a team\'s array of monpoke if its health points reach zero or below', () => {
    game.addTeam('Team1', 'Monpoke1', 1, 17);
    game.addTeam('Team2', 'Monpoke2', 2, 2);
    game.choose('Monpoke1');
    game.choose('Monpoke2');
    game.attack('Monpoke1');
    assert.equal(game.team2.monpoke.length, 0);
  })

  it('when a team\'s array of monpoke is exhausted (reaches zero) the game should end', () => {
    game.addTeam('Team1', 'Monpoke1', 1, 17);
    game.addTeam('Team2', 'Monpoke2', 2, 2);
    game.choose('Monpoke1');
    game.choose('Monpoke2');
    game.attack('Monpoke1');
    assert.isTrue(game.gameOver);
  })
})