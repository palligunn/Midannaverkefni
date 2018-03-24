var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });//setur inn stærðina af leiknum á browserinn og teiknar inná

function preload() {//hleður inn myndirnar sem verða tilbúnar í notkun

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {//byggir leikinn með að setja inn allar myndir sem þú kallaðir á
	game.physics.startSystem(Phaser.Physics.ARCADE);//þetta hleður inn myndum af bakgrunninum og hvert það á að fara í leiknum, ásamt að segja því hvernig þetta á að haga sér.
	game.add.sprite(0, 0, 'sky');//setur inn myndina 'sky' á 0,0
	platforms = game.add.group();//setur inn platforma fyrir jörðina
	platforms.enableBody = true;//setur physics á platform objectið
	var ground = platforms.create(0, game.world.height - 64, 'ground');//býr til jörðina og skýrir það 'ground'
	ground.scale.setTo(2,2);//stækkar myndina til þess að hún passi í leikinn
	ground.body.immovable = true;//passar það að jörðinn detti ekki úr ramma eða færist
	var ledge = platforms.create(100, 400, 'ground');//setur inn tvo aðra platforma og notar ground fyrir það
	ledge.body.immovable = true;//gerir það sama fyrir platformana og fyrir jörðina
	ledge = platforms.create(-150, 250, 'ground');
	ledge.body.immovable = true;
}

function update() {
}
