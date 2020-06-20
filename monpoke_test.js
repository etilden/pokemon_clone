// const { expect } = require('chai')
const { assert } = require('chai')
const MonpokeGame = require('./monpoke')

describe('Monpoke Game Class', () => {
  let game; 
  beforeEach(() => {
    game = new MonpokeGame(); 
  }); 

  it('adds a single team with the .addTeam() method, starting with team1', () => {
    game.addTeam('Team1', 'Monopoke1', 1, 1);
    assert.equal(game.team1.teamId, 'Team1');
  })

  it('adds two teams without overwriting the first team name', () => {
    game.addTeam('Team1', 'Monopoke1', 1, 1);
    game.addTeam('Team2', 'Monopoke2', 2, 2);
    assert.equal(game.team1.teamId, 'Team1');
    assert.equal(game.team2.teamId, 'Team2');
  })

  it ('does not add more than two teams or overwrite teams when three are added', () => {
    game.addTeam('Team1', 'Monopoke1', 1, 1);
    game.addTeam('Team2', 'Monopoke2', 2, 2);
    game.addTeam('Team3', 'Monopoke3', 3, 3);
    assert.equal(game.team1.teamId, 'Team1');
    assert.equal(game.team2.teamId, 'Team2');
  })

  // it ()
})