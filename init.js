var context;
var queue;
var WIDTH = 1348;
var HEIGHT = 620;
var mouseXPosition;
var mouseYPosition;
var cowboyImage;
var stage;
var animation;
var deathAnimation;
var spriteSheet=[];
var enemyXPos=100;
var enemyYPos=100;
var enemyXSpeed = 1.5;
var enemyYSpeed = 1.75;
var score = 0;
var bullet = 6;
var scoreText;
var gameText;
var bullets = [];
var Bpos=1100;
var crosshair;
var backgroud;
var background2;
var rand;
var state;
var ticks=0;
var life=100;
var lifeText;
var no_reload=1;
var victims=0;

window.onload = function()
{
    /*
     *      Set up the Canvas with Size and height
     *
     */
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = WIDTH;
    context.canvas.height = HEIGHT;
    stage = new createjs.Stage("myCanvas");

    /*
     *      Set up the Asset Queue and load sounds
     *
     */
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.on("complete", queueLoaded, this);
    createjs.Sound.alternateExtensions = ["ogg"];

    /*
     *      Create a load manifest for all assets
     *
     */
    queue.loadManifest([
        {id: 'backgroundImage', src: 'assets/background.png'},
		{id: 'backgroundImage2', src: 'assets/background2.png'},
        {id: 'crosshairImage', src: 'assets/crosshair.png'},
		{id: 'hole', src: 'assets/hole.png'},
        {id: 'shot', src: 'assets/shot.mp3'},
        {id: 'background', src: 'assets/wildwest.mp3'},
        {id: 'deathSound', src: 'assets/death.mp3'},
		{id: 'deathSound2', src: 'assets/female.mp3'},
		{id: 'reload', src: 'assets/reload.mp3'},
		{id: 'enemy', src: 'assets/enemy.mp3'},
		{id: 'bonusSound', src: 'assets/star.mp3'},
		{id: 'death', src: 'assets/death.wav'},
		{id: 'star', src: 'assets/bonus.png'},
        {id: 'cowboy', src: 'assets/cowboy.png'},
		{id: 'cowboy2', src: 'assets/cowboy2.png'},
		{id: 'cowboy3', src: 'assets/cowboy3.png'},
		{id: 'cowboy4', src: 'assets/cowboy4.png'},
		{id: 'neutral', src: 'assets/neutral.png'},
		{id: 'neutral2', src: 'assets/neutral2.png'},
		{id: 'neutral3', src: 'assets/neutral3.png'},
		{id: 'bullet', src: 'assets/bullet.png'},
        {id: 'cowboyDeath', src: 'assets/cowboyDeath.png'},
    ]);
    queue.load();

    /*
     *      Create a timer that updates once per second
     *
     */
    gameTimer = setInterval(update, 1000);

}

function queueLoaded(event)
{
    // Add background image
    background= new createjs.Bitmap(queue.getResult("backgroundImage"));
    stage.addChild(background);
	
	crosshair = new createjs.Bitmap(queue.getResult("crosshairImage"));
    crosshair.x = event.clientX;
    crosshair.y = event.clientY;
	stage.addChild(crosshair);
	
	for (i = 0; i < 6; i++) {
    bullets[i] = new createjs.Bitmap(queue.getResult("bullet"));
	bullets[i].x = Bpos;
    bullets[i].y = 530;
	Bpos+=20;
	stage.addChild(bullets[i]);
}
	
    //Add Score
    scoreText = new createjs.Text("Score: " + score.toString(), "36px RieslingRegular", "#FFF");
    scoreText.x = 10;
    scoreText.y = 10;
    stage.addChild(scoreText);
	
	lifeText = new createjs.Text("Life: " + life.toString() +"%", "36px RieslingRegular", "#FFF");
    lifeText.x = 1150;
    lifeText.y = 10;
    stage.addChild(lifeText);


    gameText = new createjs.Text("", "36px Arial", "#FFF");

    // Play background sound
    createjs.Sound.play("background", {loop: -1});

    // Create spritesheets
    spriteSheet[0] = new createjs.SpriteSheet({
        "images": [queue.getResult('cowboy')],
        "frames": {"width": 140, "height": 200},
        "animations": { "flap": [0,0] }
    });

	// Create spritesheets
    spriteSheet[1] = new createjs.SpriteSheet({
        "images": [queue.getResult('cowboy2')],
        "frames": {"width": 140, "height": 200},
        "animations": { "flap": [0,0] }
    });
	
	// Create spritesheets
    spriteSheet[2] = new createjs.SpriteSheet({
        "images": [queue.getResult('cowboy3')],
        "frames": {"width": 140, "height": 200},
        "animations": { "flap": [0,0] }
    });
	
	// Create spritesheets
    spriteSheet[3] = new createjs.SpriteSheet({
        "images": [queue.getResult('cowboy4')],
        "frames": {"width": 140, "height": 200},
        "animations": { "flap": [0,0] }
    });
	
	// Create spritesheets
    spriteSheet[4] = new createjs.SpriteSheet({
        "images": [queue.getResult('neutral')],
        "frames": {"width": 140, "height": 200},
        "animations": { "flap": [0,0] }
    });
	
	// Create spritesheets
    spriteSheet[5] = new createjs.SpriteSheet({
        "images": [queue.getResult('neutral2')],
        "frames": {"width": 140, "height": 200},
        "animations": { "flap": [0,0] }
    });
	
	// Create spritesheets
    spriteSheet[6] = new createjs.SpriteSheet({
        "images": [queue.getResult('neutral3')],
        "frames": {"width": 140, "height": 200},
        "animations": { "flap": [0,0] }
    });
	
	spriteSheet[7] = new createjs.SpriteSheet({
        "images": [queue.getResult('star')],
        "frames": {"width": 100, "height": 100},
        "animations": { "flap": [0,6] }
    });
	
    cowboyDeathSpriteSheet = new createjs.SpriteSheet({
    	"images": [queue.getResult('cowboyDeath')],
    	"frames": {"width": 198, "height" : 148},
    	"animations": {"die": [0,7, false,1 ] }
    });

     // Create sprite
    createEnemy();


    // Add ticker
    createjs.Ticker.setFPS(15);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);

    // Set up events AFTER the game is loaded
    window.onmousemove = handleMouseMove;
    window.onmousedown = handleMouseDown;
}

function createEnemy()
{
	var rand;
	rand=Math.floor((Math.random() * 8)); 
	state=rand;
	animation = new createjs.Sprite(spriteSheet[rand], "flap");
    animation.regX = 58;
    animation.regY = 58;
	var randx=Math.floor((Math.random() * 1300));
	var randy=Math.floor((Math.random() * 300)+300);
    animation.x = randx;
    animation.y = randy;
    animation.gotoAndPlay("flap");
    stage.addChildAt(animation,1);
}

function enemyDeath()
{
  deathAnimation = new createjs.Sprite(cowboyDeathSpriteSheet, "die");
  deathAnimation.regX = 99;
  deathAnimation.regY = 58;
  deathAnimation.x = enemyXPos;
  deathAnimation.y = enemyYPos;
  deathAnimation.gotoAndPlay("die");
  stage.addChild(deathAnimation);
}

function tickEvent()
{
	if(state==7)
	{
		//Make sure object is within game boundaries and move enemy cowboy
		if(enemyXPos < WIDTH && enemyXPos > 0)
		{
			enemyXPos += enemyXSpeed;
		} else 
		{
			enemyXSpeed = enemyXSpeed * (-1);
			enemyXPos += enemyXSpeed;
		}
		if(enemyYPos < HEIGHT && enemyYPos > 0)
		{
			enemyYPos += enemyYSpeed;
		} else
		{
			enemyYSpeed = enemyYSpeed * (-1);
			enemyYPos += enemyYSpeed;
		}

		animation.x = enemyXPos;
		animation.y = enemyYPos;
	}
		
	
	var timeToCreate = Math.floor((Math.random()*10000)+100);
	var maxticks;
	if(state>3)
	{
		if(state==7)
		{
			maxticks=5;
		}
		else
		maxticks=10;
			if(ticks==maxticks)
			{
				ticks=0;
				stage.removeChild(animation);
				setTimeout(createEnemy,timeToCreate);
			}
		
	}
	else if(state<4)
	{
		maxticks=10;
			if(ticks==maxticks)
			{
				ticks=0;
				createjs.Sound.play("enemy");
				life-=25;
				if(life==0)
				update;
				else
				{
				lifeText.text = "Life: " + life.toString() +"%";
				stage.removeChild(animation);
				setTimeout(createEnemy,timeToCreate);
				}
			}
	}
}

	

function handleMouseMove(event)
{
    crosshair.x = event.clientX-52;
    crosshair.y = event.clientY-52;
	stage.addChild(crosshair);
}

function handleMouseDown(event)
{
	
    if(bullet!=0)
	{
    hole = new createjs.Bitmap(queue.getResult("hole"));
    hole.x = event.clientX-33;
    hole.y = event.clientY-32;
    stage.addChild(hole);
    createjs.Tween.get(hole).to({alpha: 0},1000);
    
    //Play Gunshot sound
    createjs.Sound.play("shot");

    //Increase speed of enemy slightly
    enemyXSpeed += 0.1;
    enemyYSpeed += 0.1;
    //Obtain Shot position
    var shotX = Math.round(event.clientX);
    var shotY = Math.round(event.clientY);
    var spriteX = Math.round(animation.x);
    var spriteY = Math.round(animation.y);

    // Compute the X and Y distance using absolte value
    var distX = Math.abs(shotX - spriteX);
    var distY = Math.abs(shotY - spriteY);

    if(distX < 30 && distY < 59 )
    {
    	//Hit
    	stage.removeChild(animation);
    	enemyDeath();
		if(state<4 || state==7)
    	score+=100;
		else
		{
			score-=100;
			victims+=1;
		}
    	scoreText.text = "Score: " + score.toString();
		if(state<5)
    	createjs.Sound.play("deathSound");
		else if(state>4 && state!=7)
		createjs.Sound.play("deathSound2");
		else
		createjs.Sound.play("bonusSound");
		
		if(state!=7)
	{
		bullet-=1;
		stage.removeChild(bullets[bullet]);
		Bpos-=20;
	}
	else
	{
		for (i = bullet; i < 6; i++) 
		{
			Bpos+=20;
			stage.addChild(bullets[i]);
			bullet++;
		}
		life=100;
		lifeText.text = "Life: " + life.toString() +"%";
	}
	
    	//Create new enemy
		ticks=0;
	    setTimeout(createEnemy,0);
		

    } else
    {
    	//Miss
    	score -= 10;
    	scoreText.text = "Score: " + score.toString();
		bullet-=1;
		stage.removeChild(bullets[bullet]);
		Bpos-=20;

    }
}
}

function reload()
{
		for (i = bullet; i < 6; i++) 
		{
			Bpos+=20;
			stage.addChild(bullets[i]);
			bullet++;
		}
		no_reload=1;
}
function update()
{
	ticks+=1;
	
	if(bullet==0 && no_reload && life>0)
	{
		createjs.Sound.play("reload");
		no_reload=0;
		setTimeout(reload,3000);
	}
	if(life<=0 || victims>2)
	{
		createjs.Sound.play("death");
		stage.removeChild(animation);
		stage.removeChild(hole);
		stage.removeChild(background);
		stage.removeChild(crosshair);
		bullet=0;
		background2 = new createjs.Bitmap(queue.getResult("backgroundImage2"))
		stage.addChild(background2);
		stage.addChild(scoreText);
		gameText = new createjs.Text("GAME OVER", "36px Arial", "#FFF");
		gameText.x = 550;
		gameText.y = 250;
		stage.addChild(gameText);
		scoreText.x = 580;
		scoreText.y = 300;
        createjs.Sound.removeSound("background");
		clearInterval(gameTimer);
	}
}
