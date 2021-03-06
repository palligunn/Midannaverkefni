var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });//setur inn stærðina af leiknum á browserinn og teiknar inná

var player;
var platforms;
var cursors;

var stars;
var diamonds;
var baddi;
var score = 0;
var scoreText;

var randomx;
var randomy;
var stateText;

var badCount = 0;
var count = 0;

function preload() {//hleður inn myndirnar sem verða tilbúnar í notkun
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('demantur', 'assets/diamond.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('baddi', 'assets/baddie.png', 32, 32);
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

	randomx = Math.random()*256;
	randomy = Math.random()*300

	player = game.add.sprite(32, game.world.height - 200, 'dude');//setur playerinn inn í leikinn og gefur honum sama physics og platforminn
	game.physics.arcade.enable(player)

	player.body.bounce.y = 0.3;//lætur kallinn skoppa smátt
	player.body.gravity.y = 300;//stillir þyngdaraflið fyrir kallinn
	player.body.collideWorldBounds = true;

	//spilar animations fyrir hreyfingarnar á kallinum til hægri og vinstri
	player.animations.add('left', [0,1,2,3], 10, true);//rammarnir teljast frá 0-8 er sitthvor mynd, að alls eru 9 myndir
	player.animations.add('right', [5,6,7,8], 10, true);//seinasta talan '10' segir hversu marga ramma á sekúndu þeir skiptast

	cursors = game.input.keyboard.createCursorKeys();//bætir við stýringum

	// Stjörnur settar í hóp
	stars = game.add.group(); 
	stars.enableBody = true; 

	// 8 stjörnur búnar til
	for (var i=0; i<8; i++) {
		var star = stars.create(Math.random()*790, -18, 'star');
		star.body.gravity.y = 300;
	}		

	// Demantar settir í hóp
	demantar = game.add.group(); 
	demantar.enableBody = true; 	

	// Baddar settir í hóp
	baddis = game.add.group(); 
	baddis.enableBody = true; 

	// Texti settur fyrir stig og sigur.
	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});
	stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.visible = false;
}

function update() {
	var hitPlatform = game.physics.arcade.collide(player, platforms);//segir kóðanum að kallinn kemst ekki í gegn um platforms
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.collide(baddis, platforms);

	// Ef stig fara í 1000+ þá vinnurðu leikinn og færð leik lokið skilaboð
	if (score >= 1000) {
		scoreText.text = 'SIGUR!';	
		stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '42px Arial', fill: '#fff' });
		player.kill();
		stateText.text = " Þú vannst! \n Smelltu til að endurræsa";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

    // Ef leikmaður snertir stjörnu, demant eða badda þá er viðeigandi fall keyrt
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	game.physics.arcade.overlap(player, demantar, collectDiamond, null, this);
	game.physics.arcade.overlap(player, baddis, baddiKO, null, this);

	player.body.velocity.x = 0

	if (cursors.left.isDown)//ef það er ýtt á vinstri örvatakkann þá færist kallinn til vinstri
	{
		player.body.velocity.x = -150;

		player.animations.play('left');
	}

	else if (cursors.right.isDown)//ef það er ýtt á hægri örvatakkann þá færist kallinn til hægri
	{
		player.body.velocity.x = 150;

		player.animations.play('right');
	}
	else
	{
		player.animations.stop();
		player.frame = 4;//ef kallinn gerir ekki neitt þá er notað mynd nr.4
	}

	if (cursors.up.isDown && player.body.touching.down && hitPlatform)
	{
		player.body.velocity.y = -350;
	}
}

// Fall sem er keyrt ef leikmaður snertir stjörnu, gefur 10 stig
function collectStar (player, star) {
	star.kill();
	count += 1;
	spawnStars();

	score += 10;
	scoreText.text = 'Score: ' + score;
}

// Fall sem er keyrt ef leikmaður snertir demant, gefur 100 stig
function collectDiamond (player, demantur) {
	demantur.kill();
	spawnStars();

	score += 100;
	scoreText.text = 'Score: ' + score;
}

// Fall sem er keyrt ef leikmaður snertir badda, dregur frá 100 stig
function baddiKO (player, baddi) {
	baddi.kill();
	spawnStars();

	badCount -= 1;

	score -= 100;
	scoreText.text = 'Score: ' + score;
}

// Fall sem býr til demant og stjörnu í 10. hverju kalli, badda í 5. hverju og annars stjörnu
function spawnStars () {
	if (count%10==9){
		var demantur = demantar.create(Math.random()*790, -18, 'demantur');
		demantur.body.gravity.y = 100;
		var star = stars.create(Math.random()*790, -18, 'star');
		star.body.gravity.y = 300;
	} else if (count%10==5 && badCount < 5) {
		var baddi = baddis.create(Math.random()*790, -18, 'baddi');
		baddi.body.gravity.y = 300;
		badCount += 1
	} else {
		var star = stars.create(Math.random()*790, -18, 'star');
		star.body.gravity.y = 300;
	}
}

// Fall til að endurræsa talningu, stig og leikinn. 
function restart() {
	score = 0; 
	count = 0;
	badCount = 0;
	scoreText.text = 'Score: ' + score;
	player.revive();
    stateText.visible = false;
	create();
}
