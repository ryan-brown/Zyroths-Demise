// Game Class
// This is the heart and soul of Dragon Defender
var Game = (function () {
  // The almighty list of variables. Oh boy.
  var canvas, ctx, 
      dragon, fireballs, peasants, knights, coins,
      peasantSpawnTime, currPeasantSpawnTime, minPeasantSpawnTime,
      knightSpawnTime, currKnightSpawnTime, minKnightSpawnTime,
      lastTime,
      highscore, newHighscore,
      dragonSprite, fireballSprite, peasantSprite, coinSprite, 
      deadDragonImg, backgroundImg,
      fireballSound, magicSound, chingSound, chinkSound, newHighscoreSound,
      dragonDeathSound, peasantDeathSound, knightDeathSound, 
      muteMusic, musicSound, muteSound,
      gameOver,
      interval;

  // Constructor
  // Initialize everything with given canvas ID of html element
  var self = function (id) {
    // Grab the canvas and context (canvas init stuff)
    canvas = document.getElementById(id);
    ctx = canvas.getContext('2d');

    // Default hightscore = 1000 and newHighscore = false
    highscore = 1000;
    newHighscore = false;

    // The game is not over... yet.
    gameOver = false;

    // Don't assume they want my beautiful music muted
    muteSound = false;
    muteMusic = false;

    // Load sounds
    fireballSound = new Audio("audio/fireball.wav");
    magicSound = new Audio("audio/magic.wav");
    chingSound = new Audio("audio/ching.wav");
    chinkSound = new Audio("audio/chink.wav");
    dragonDeathSound = new Audio("audio/dragonDeath.wav");
    peasantDeathSound = new Audio("audio/peasantDeath.wav");
    knightDeathSound = new Audio("audio/knightDeath.wav");
    newHighscoreSound = new Audio("audio/newHighscore.wav");
    musicSound = new Audio("audio/music2.wav");
    musicSound.loop = true;
    musicSound.play();
    
    // Load Images
    backgroundImg = new Image();
    backgroundImg.src = "img/desert.png";

    dragonSprite = new Image();
    dragonSprite.src = "img/dragonSprite.png";
    dragonSprite_flip = new Image();
    dragonSprite_flip.src = "img/dragonSprite_flip.png";

    dragonImgDead = new Image();
    dragonImgDead.src = "img/deadDragon.png";

    fireballSprite = new Image();
    fireballSprite.src = "img/fireballSprite.png";

    peasantSprite = new Image();
    peasantSprite.src = "img/peasantSprite.png";
    peasantSprite_flip = new Image();
    peasantSprite_flip.src = "img/peasantSprite_flip.png";

    knightSprite = new Image();
    knightSprite.src = "img/knightSprite.png";
    knightSprite_flip = new Image();
    knightSprite_flip.src = "img/knightSprite_flip.png";

    coinSprite = new Image();
    coinSprite.src = "img/coinSprite.png";

    // Reset the game, more initialization stuff
    reset();

    // Listen for keydown events on page
    addEventListener('keydown', function (e) {
      switch(e.keyCode) {
        case 82: // r
          reset();
          break;
        case 32: // space
          e.preventDefault();
          dragon.tryToMagicFire = true;
          break;
        case 87: // w
          dragon.upPressed = true;
          break;
        case 83: // s
          dragon.downPressed = true;
          break;
        case 65: // a
          dragon.leftPressed = true;
          break;
        case 68: // d
          dragon.rightPressed = true;
          break;
      }
    });

    // Listen for keyup events on page
    addEventListener('keyup', function (e) {
      switch(e.keyCode) {
        case 32: // space
          dragon.tryToMagicFire = false;
          break;
        case 87: // w
          dragon.upPressed = false;
          break;
        case 83: // s
          dragon.downPressed = false;
          break;
        case 65: // a
          dragon.leftPressed = false;
          break;
        case 68: // d
          dragon.rightPressed = false;
          break;
      }
    });

    // Listen for mousedown events on canvas
    canvas.addEventListener('mousedown', function (e) {
      dragon.firing = true;
      
    });

    // Listen for mouseup events on canvas
    canvas.addEventListener('mouseup', function (e) {
      dragon.firing = false;
    });

    // Listen for mousemove events on canvas
    canvas.addEventListener('mousemove', function (e) {
      dragon.updateMouse(getMousePos(e.x, e.y));
    });

    // Mute Music button
    document.getElementById("muteMusicButton").addEventListener('click', function() {
      if(muteMusic) {
        musicSound.play();
        muteMusic = false;
      }
      else {
        musicSound.pause();
        muteMusic = true;
      } 
    });

    // Mute Sound button
    document.getElementById("muteSoundButton").addEventListener('click', function() {
      muteSound = !muteSound;
    });

    // Set the initial last time to now.
    lastTime = new Date().getTime();
  };

  // Reset the game
  function reset() {
      if(newHighscore) highscore = dragon.score;
      dragon = new Dragon();
      fireballs = [];
      peasants = [];
      knights = [];
      coins = [];

      peasantSpawnTime = 3;
      minPeasantSpawnTime = .7;
      currPeasantSpawnTime = peasantSpawnTime;

      knightSpawnTime = 10;
      minKnightSpawnTime = 1.75;
      currKnightSpawnTime = knightSpawnTime;

      newHighscore = false;

      gameOver = false;
    }

  // game loop
  var loop = function () {
    var newTime = new Date().getTime();
    var delta = newTime - lastTime;
    lastTime = newTime;
    if(!gameOver) { update(delta); }
    draw();  
  }

  // Game update based on given delta (time since last tick in ms)
  var update = function (delta) {
    dragon.update(delta);
    if(dragon.movingUp   || 
       dragon.movingDown || 
       dragon.movingLeft || 
       dragon.movingRight) {
      dragon.animator.updateAnimation(delta);
    }

    if(dragon.score > highscore && !newHighscore) {
      newHighscore = true;

      if(!muteSound) {
        newHighscoreSound.currentTime=0;
        newHighscoreSound.play();
      }
    }

    if(dragon.firing && dragon.currFireDelay <= 0) {
      fireballs.push(dragon.fire()); 
      if(!muteSound) {
        fireballSound.currentTime=0;
        fireballSound.play();
      }
    }
    if(dragon.tryToMagicFire && !dragon.magicFiring && dragon.mana >= 50) {
      dragon.magicFiring = true;
      fireballs = fireballs.concat(dragon.magic());

      if(!muteSound) {
        magicSound.currentTime=0;
        magicSound.play();
      }
    }
    if(!dragon.tryToMagicFire) {
      dragon.magicFiring = false;
    }

    for(var i = 0; i < fireballs.length; i++) {
      fireballs[i].update(delta);
      fireballs[i].animator.updateAnimation(delta);
      if(fireballs[i].entity.x < 0 || 
        fireballs[i].entity.x > 800 || 
        fireballs[i].entity.y < 0 || 
        fireballs[i].entity.y > 600) fireballs.splice(i, 1);
    }

    for(var i = 0; i < peasants.length; i++) {
      peasants[i].update(dragon.entity, delta);
      peasants[i].animator.updateAnimation(delta);
    }

    for(var i = 0; i < knights.length; i++) {
      knights[i].update(dragon.entity, delta);
      knights[i].animator.updateAnimation(delta);
    }

    if(currPeasantSpawnTime > 0) currPeasantSpawnTime -= delta/1000;
    else {
      if(peasantSpawnTime > minPeasantSpawnTime) {
        peasantSpawnTime *= 0.995;
      }
      peasants.push(new Peasant());
      currPeasantSpawnTime = Math.random()*peasantSpawnTime+0.2;
    }

    if(currKnightSpawnTime > 0) currKnightSpawnTime -= delta/1000;
    else {
      if(knightSpawnTime > minKnightSpawnTime) {
        knightSpawnTime *= 0.98;
      }
      knights.push(new Knight());
      currKnightSpawnTime = Math.random()*knightSpawnTime+1;
    }

    for(var i = 0; i < peasants.length; i++) {
      if(peasants[i].entity.collide(dragon.entity)) {
        gameOver = true;

        if(!muteSound) {
          dragonDeathSound.currentTime=0;
          dragonDeathSound.play();
        }

        break;
      }
      for(var j = 0; j < fireballs.length; j++) {
        if(peasants[i].entity.collide(fireballs[j].entity)) {
          peasants[i].hp--;

          if(peasants[i].hp <= 0) {
            if(Math.random() < 0.1) {
              var coin = new Coin(
                peasants[i].entity.x, 
                peasants[i].entity.y);
              coins.push(coin);
            }

            dragon.score += 10;
            dragon.mana += 1;
            if(dragon.mana > 100) dragon.mana = 100;

            peasants.splice(i, 1);

            if(!muteSound) {
              peasantDeathSound.currentTime=0;
              peasantDeathSound.play();
            }
          }
          fireballs.splice(j, 1);
          break;
        } 
      }
    }

    for(var i = 0; i < knights.length; i++) {
      if(knights[i].entity.collide(dragon.entity)) {
        gameOver = true;

        dragonDeathSound.currentTime=0;
        dragonDeathSound.play();

        break;
      }
      for(var j = 0; j < fireballs.length; j++) {
        if(knights[i].entity.collide(fireballs[j].entity)) {
          knights[i].hp--;

          if(knights[i].hp <= 0) {
            if(Math.random() < 0.25) {
              var coin = new Coin(
                knights[i].entity.x, 
                knights[i].entity.y);
              coins.push(coin);
            }

            dragon.score += 50;
            dragon.mana += 3;
            if(dragon.mana > 100) dragon.mana = 100;

            knights.splice(i, 1);

            if(!muteSound) {
              knightDeathSound.currentTime=0;
              knightDeathSound.play();
            }
          }
          else {
            if(!muteSound) {
              chinkSound.currentTime=0;
              chinkSound.play();
            }
          }
          fireballs.splice(j, 1);
          break;
        } 
      }
    }

    for(var i = 0; i < coins.length; i++) {
      coins[i].animator.updateAnimation(delta);
      if(coins[i].entity.collide(dragon.entity)) {
        coins.splice(i, 1);
        dragon.score += 100;

        if(!muteSound) {
          chingSound.currentTime=0;
          chingSound.play();
        }
      } 
    }
  }

  // Draw to canvas!
  var draw = function () {
    ctx.fillStyle = "#DDDDDD";
    ctx.clearRect(0, 0, 800, 600);
    ctx.drawImage(backgroundImg, 0, 0);

    if(gameOver) drawSprite(dragonImgDead, dragon.entity);
    else if(dragon.facingLeft) {
      drawSpriteSheet(dragonSprite, dragon);
    }
    else {
      drawSpriteSheet(dragonSprite_flip, dragon);
    }
    for(var i = 0; i < coins.length; i++) {
      drawSpriteSheet(coinSprite, coins[i]);
    }
    for(var i = 0; i < fireballs.length; i++) {
      drawSpriteSheet(fireballSprite, fireballs[i]);
    }
    for(var i = 0; i < peasants.length; i++) {
      if(peasants[i].facingLeft) {
        drawSpriteSheet(peasantSprite, peasants[i]);
      }
      else {
        drawSpriteSheet(peasantSprite_flip, peasants[i]);
      }
    }
    for(var i = 0; i < knights.length; i++) {
      if(knights[i].facingLeft) {
        drawSpriteSheet(knightSprite, knights[i]);
      }
      else {
        drawSpriteSheet(knightSprite_flip, knights[i]);
      }
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(299, 569, 202, 27);

    if(dragon.mana < 50) ctx.fillStyle = '#994488';
    else ctx.fillStyle = '#66ccff';
    
    ctx.fillRect(300, 570, Math.round(dragon.mana*2), 25);

    ctx.textAlign = "center"; 
    ctx.textBaseline = "middle"; 
    ctx.font = "24px 'Lucida Grande'";
    drawFancyText(
      Math.floor(dragon.mana) + "/" + Math.round(dragon.maxMana), 
      400, 
      583);

    ctx.textAlign = "left"; 
    ctx.textBaseline = "top"; 
    drawFancyText("Score: "+Math.round(dragon.score), 5, 0);
    ctx.textAlign = "center"; 
    if(newHighscore) {
      drawFancyText("New Highscore!", 400, 0);
    }
    else {
      drawFancyText("Highscore: "+Math.round(highscore), 400, 0);
    }
    

    if(gameOver) {
      ctx.textAlign = "center"; 
      ctx.textBaseline = "middle"; 
      ctx.font = "48px 'Lucida Grande'";
      drawFancyText("You have been slain.", 400, 260);
      drawFancyText("Press R to play again!", 400, 340);
    }
  }

  // Draw fancy text to canvas
  // Takes text to print and (x, y) coordinates
  function drawFancyText(text, x, y) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = '#DDFFEE';
    ctx.fillText(text, x, y);
  }

  // Draw plain old lame static sprite
  // Takes an image to draw and an entity to base it on
  var drawSprite = function (img, entity) {
    ctx.drawImage(
      img, 
      entity.x-entity.width/2, 
      entity.y-entity.height/2,
      entity.width,
      entity.height);
  }

  // Draw a sprite from a sprite sheet
  // Takes a spritesheet to draw from and object to base it on
  var drawSpriteSheet = function(img, obj) {
    ctx.drawImage(
      img, 
      obj.animator.animCurrFrame*obj.entity.width,
      0,
      obj.entity.width,
      obj.entity.height,
      obj.entity.x-obj.entity.width/2, 
      obj.entity.y-obj.entity.height/2,
      obj.entity.width,
      obj.entity.height);
  }

  // Since mouse events give (x, y) on the page
  // We need to adjust it to (x, y) on the canvas
  var getMousePos = function (x, y) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(x - rect.left), 
      y: Math.round(y - rect.top)
    };
  }

  // Prototype of class
  self.prototype = {
    constructor: self,
    start: function() { interval = setInterval(loop, 10) },
  };

  // return the game
  return self;
})();

// Initialize a new game and start her up!
new Game("canvas").start();
