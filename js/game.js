// Game Class
// This is the heart and soul of Dragon Defender
var Game = function(id) {
  // The almighty list of variables. Oh boy.
  var canvas, ctx, 
      dragon, fireballs, peasants, knights, coins,
      peasantSpawnTime, currPeasantSpawnTime, minPeasantSpawnTime,
      knightSpawnTime, currKnightSpawnTime, minKnightSpawnTime,
      floatingText,
      lastTime,
      highscore, newHighscore,
      peasantsSlain, knightsSlain, coinsCollected, noSpecial,
      dragonSprite, fireballSprite, peasantSprite, coinSprite, 
      deadDragonImg, backgroundImg,
      fireballSound, magicSound, chingSound, chinkSound, newHighscoreSound,
      dragonDeathSound, peasantDeathSound, knightDeathSound, 
      muteMusic, musicSound, muteSound,
      pressingPause, pressingPauseBefore, paused, gameOver,
      achievements,
      interval;

  // List of functions
  var init, reset, loop,
      update, updateObjects, handleCollisions, 
      updateGame, updateSpawnTimes, updateAnimations,
      draw, drawFancyText, drawSprite, drawSpriteSheet,
      getMousePos;

  // Initialize variables, load images/sounds, and set event listeners
  init = function() {
    // Grab the canvas and context (canvas init stuff)
    canvas = document.getElementById(id);
    ctx = canvas.getContext('2d');

    // Default hightscore = 1000 and newHighscore = false
    highscore = 1000;
    newHighscore = false;

    // Achievements
    achievements = [];
    achievements['kill_25_peasants'] = false;
    achievements['kill_100_peasants'] = false;
    achievements['kill_5_knights'] = false;
    achievements['kill_25_knights'] = false;
    achievements['collect_10_coins'] = false;
    achievements['collect_25_coins'] = false;
    achievements['get_1000_points'] = false;
    achievements['get_5000_points'] = false;
    achievements['get_10000_points'] = false;
    achievements['get_15000_points'] = false;
    achievements['get_2500_points_no_special'] = false;
    achievements['get_5000_points_no_special'] = false;
    achievements['get_7500_points_no_special'] = false;

    // The game is not over... yet.
    gameOver = false;

    // The game is not paused
    paused = false;
    pressingPause = false;
    pressingPauseBefore = false;

    // Don't assume they want my beautiful music muted
    muteSound = false;
    muteMusic = false;

    // Load sounds
    fireballSound = new Audio("audio/fireball.wav");
    magicSound = new Audio("audio/magic.wav");
    chingSound = new Audio("audio/ching.wav");
    chinkSound = new Audio("audio/dink.wav");
    dragonDeathSound = new Audio("audio/nateDeath.wav");
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
        case 80: // p
          pressingPause = true;
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
        case 80: // p
          pressingPause = false;
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
        document.getElementById("muteMusicButton").innerHTML = "Mute Music";
      }
      else {
        musicSound.pause();
        muteMusic = true;
        document.getElementById("muteMusicButton").innerHTML = "Unmute Music";
      } 
    });

    // Mute Sound button
    document.getElementById("muteSoundButton").addEventListener('click', function() {
      muteSound = !muteSound;
      if(muteSound) document.getElementById("muteSoundButton").innerHTML = "Unmute Sound";
      else document.getElementById("muteSoundButton").innerHTML = "Mute Sound";
    });

    // Set the initial last time to now.
    lastTime = new Date().getTime();
  }
  

  // Reset the game
  reset = function() {
    // Reset all relevant variables
    if(newHighscore) highscore = dragon.score;
    dragon = new Dragon();
    fireballs = [];
    peasants = [];
    knights = [];
    coins = [];
    floatingText = [];

    peasantsSlain = 0;
    knightsSlain = 0;
    coinsCollected = 0;
    noSpecial = true;

    paused = false;
    pressingPause = false;
    pressingPauseBefore = false;

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
  loop = function() {
    // Calculate time since last tick in ms
    var newTime = new Date().getTime();
    var delta = newTime - lastTime;
    lastTime = newTime;

    if(!gameOver) {
      if(pressingPause && !pressingPauseBefore) {
        paused = !paused;
        pressingPauseBefore = true;
      }
      else if(!pressingPause) {
        pressingPauseBefore = false;
      }
    }

    // if game running, update the game
    if(!gameOver && !paused) { 
      update(delta); 
    }
    
    // Draw the game to canvas
    draw();  
  }

  // Update objects positions
  updateObjects = function(delta) {
    // Update the dragon
    dragon.update(delta);

    // For every fireball, update its position and animation
    // and if it's off the screen, delete it
    for(var i = 0; i < fireballs.length; i++) {
      fireballs[i].update(delta);
      if(fireballs[i].entity.x < 0 || 
        fireballs[i].entity.x > 800 || 
        fireballs[i].entity.y < 0 || 
        fireballs[i].entity.y > 600) fireballs.splice(i, 1);
    }

    // For every peasant, update its position and animation
    for(var i = 0; i < peasants.length; i++) {
      peasants[i].update(dragon.entity, delta);
    }

    // For every knight, update its position and animation
    for(var i = 0; i < knights.length; i++) {
      knights[i].update(dragon.entity, delta);
    }

    // For every floatingText, update its time left
    for(var i = 0; i < floatingText.length; i++) {
      floatingText[i].update(delta);
      if(floatingText[i].time <= 0) floatingText.splice(i, 1);
    }
  }

  // Handle collisions
  handleCollisions = function() {
    // For every peasant, check collisions with dragon and fireballs
    for(var i = 0; i < peasants.length; i++) {
      // If this peasant is colliding with the dragon, end game
      if(peasants[i].entity.collide(dragon.entity)) {
        gameOver = true;

        // make sure sound is not muted
        if(!muteSound) {
          dragonDeathSound.currentTime=0;
          dragonDeathSound.play();
        }

        // game is over so just break the loop
        break;
      }

      // If game still in progress, check for collisions with fireballs
      for(var j = 0; j < fireballs.length; j++) {
        if(peasants[i].entity.collide(fireballs[j].entity)) {
          // fireball does 1 damage to colliding peasant
          peasants[i].hp--;

          // if peasant is dead,,,
          if(peasants[i].hp <= 0) {

            // Decide to spawn coin
            if(Math.random() < 0.1) {
              var coin = new Coin(
                peasants[i].entity.x, 
                peasants[i].entity.y);
              coins.push(coin);
            }

            // increase score and mana
            dragon.score += 10;
            dragon.mana += 1;
            if(dragon.mana > 100) dragon.mana = 100;

            peasantsSlain += 1;

            // Create new floaingPoints with 10 Points
            floatingText.push(new FloatingText(peasants[i].entity, "10"));

            // delete peasant
            peasants.splice(i, 1);

            // make sure sound isn't muted
            if(!muteSound) {
              peasantDeathSound.currentTime=0;
              peasantDeathSound.play();
            }
          }
          // delete fireball and break loop since this fireball is now gone
          fireballs.splice(j, 1);
          break;
        } 
      }
    }

    // For every knight, check collisions with dragon and fireballs
    for(var i = 0; i < knights.length; i++) {
      // If this knight is colliding with the dragon, end game
      if(knights[i].entity.collide(dragon.entity)) {
        gameOver = true;

        // make sure game isn't muted
        if(!muteSound) {
          dragonDeathSound.currentTime=0;
          dragonDeathSound.play();
        }

        // game is over so just break loop
        break;
      }

      // If game still in progress, check for collisions with fireballs
      for(var j = 0; j < fireballs.length; j++) {
        if(knights[i].entity.collide(fireballs[j].entity)) {
          // fireball does 1 damage to colliding knight
          knights[i].hp--;

          // If knight dead...
          if(knights[i].hp <= 0) {
            // Decide to spawn coin
            if(Math.random() < 0.25) {
              var coin = new Coin(
                knights[i].entity.x, 
                knights[i].entity.y);
              coins.push(coin);
            }

            // increase score and mana
            dragon.score += 50;
            dragon.mana += 3;
            if(dragon.mana > 100) dragon.mana = 100;

            knightsSlain += 1;

            // Create new floaingText with 50 Points
            floatingText.push(new FloatingText(knights[i].entity, "50"));

            // delete knight
            knights.splice(i, 1);

            // make sure sound isn't muted
            if(!muteSound) {
              knightDeathSound.currentTime=0;
              knightDeathSound.play();
            }
          }

          // Otherwise the knight took damage but did not die
          // so play the ding sound
          else {
            // make sure sound isn't muted
            if(!muteSound) {
              chinkSound.currentTime=0;
              chinkSound.play();
            }
          }

          // delete fireball 
          fireballs.splice(j, 1);

          // break since fireball is gone
          break;
        } 
      }
    }

    // For every coin check collision with dragon
    for(var i = 0; i < coins.length; i++) {
      // If coin colliding with dragon...
      if(coins[i].entity.collide(dragon.entity)) {
        // delete the coin and incease score
        dragon.score += 100;

        coinsCollected += 1;

        // Create new floaingText with 100 Points
        floatingText.push(new FloatingText(coins[i].entity, "100"));

        coins.splice(i, 1);

        // make sure sound isn't muted
        if(!muteSound) {
          chingSound.currentTime=0;
          chingSound.play();
        }
      } 
    }
  }

  // Update spawn times of peasants/knights
  updateSpawnTimes = function(delta) {
    // If its not yet time to spawn a peasant, decrerase the time left
    // Otherise spawn a peasant
    if(currPeasantSpawnTime > 0) currPeasantSpawnTime -= delta/1000;
    else {
      // Make sure the game has not reached maximum difficulty
      if(peasantSpawnTime > minPeasantSpawnTime) {
        peasantSpawnTime *= 0.995;
      }
      peasants.push(new Peasant());

      // The time before next peasant is random
      currPeasantSpawnTime = Math.random()*peasantSpawnTime+0.2;
    }

    // If its not yet time to spawn a knight, decrerase the time left
    // Otherise spawn a knight
    if(currKnightSpawnTime > 0) currKnightSpawnTime -= delta/1000;
    else {
      // Make sure the game has not reached maximum difficulty
      if(knightSpawnTime > minKnightSpawnTime) {
        knightSpawnTime *= 0.98;
      }
      knights.push(new Knight());

      // The time before next knight is random
      currKnightSpawnTime = Math.random()*knightSpawnTime+1;
    }
  }

  // Update game information
  updateGame = function() {
    // If there is a new highscore and newHighscore isn't set yet
    // (i.e. dragon JUST got a highscore)
    // then set newHighscore = true and play newHighscore sound
    if(dragon.score > highscore && !newHighscore) {
      newHighscore = true;

      // Make sure sound isn't muted
      if(!muteSound) {
        newHighscoreSound.currentTime=0;
        newHighscoreSound.play();
      }
    }

    // If the dragon is firing and is able to, fire!
    // Also play fireballSound
    if(dragon.firing && dragon.currFireDelay <= 0) {
      fireballs.push(dragon.fire()); 

      // Make sure sound isn't muted
      if(!muteSound) {
        fireballSound.currentTime=0;
        fireballSound.play();
      }
    }

    // If the dragon is trying to fire magic and isn't currently firing
    // and has sufficient mana, then fire the magic ability
    if(dragon.tryToMagicFire && !dragon.magicFiring && dragon.mana >= 50) {
      dragon.magicFiring = true;
      fireballs = fireballs.concat(dragon.magic());

      noSpecial = false;

      // Make sure sound isn't muted
      if(!muteSound) {
        magicSound.currentTime=0;
        magicSound.play();
      }
    }

    // If the dragon is not trying to fire magic, he is not firing
    if(!dragon.tryToMagicFire) {
      dragon.magicFiring = false;
    }
  }

  updateAchievements = function() {
    for(var achiev in achievements) {
      if(achievements[achiev]) {
        continue;
      }
      else if(achiev == "kill_25_peasants") {
        if(peasantsSlain >= 25) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Kill 25 Peasants"));
        }
        
      }
      else if(achiev == "kill_100_peasants") {
        if(peasantsSlain >= 100) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Kill 100 Peasants"));
        }
      }
      else if(achiev == "kill_5_knights") {
        if(knightsSlain >= 5) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Kill 5 Knights"));
        }
      }
      else if(achiev == "kill_25_knights") {
        if(knightsSlain >= 25) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Kill 25 Knights"));
        }
      }
      else if(achiev == "collect_10_coins") {
        if(coinsCollected >= 10) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Collect 10 Coins"));
        }
      }
      else if(achiev == "collect_25_coins") {
        if(coinsCollected >= 25) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Collect 25 Coins"));
        }
      }
      else if(achiev == "get_5000_points") {
        if(dragon.score >= 5000) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Get 5000 Points"));
        }
      }
      else if(achiev == "get_10000_points") {
        if(dragon.score >= 10000) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Get 10000 Points"));
        }
      }
      else if(achiev == "get_15000_points") {
        if(dragon.score >= 15000) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Get 15000 Points"));
        }
      }
      else if(achiev == "get_2500_points_no_special") {
        if(dragon.score >= 2500 && noSpecial) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Get 2500 Points without Special"));
        }
      }
      else if(achiev == "get_5000_points_no_special") {
        if(dragon.score >= 5000 && noSpecial) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Get 5000 Points without Special"));
        }
      }
      else if(achiev == "get_7500_points_no_special") {
        if(dragon.score >= 7500 && noSpecial) {
          achievements[achiev] = true;
          document.getElementById(achiev).src = "img/"+achiev+"_won.png";
          floatingText.push(new FloatingText(
            new Entity(150, 585, 0, 0),
            "New Achievement: Get 7500 Points"));
        }
      }
    }
  }

  updateAnimations = function(delta) {
    // If the dragon is moving, update his animation
    if(dragon.movingUp   || dragon.movingDown || 
       dragon.movingLeft || dragon.movingRight) {
      dragon.animator.updateAnimation(delta);
    }

    // Update animations of fireballs, peasants, knights, and coins
    for(var i = 0; i < fireballs.length; i++ ) {
      fireballs[i].animator.updateAnimation(delta);
    }
    for(var i = 0; i < peasants.length; i++ ) {
      peasants[i].animator.updateAnimation(delta);
    }
    for(var i = 0; i < knights.length; i++ ) {
      knights[i].animator.updateAnimation(delta);
    }
    for(var i = 0; i < coins.length; i++ ) {
      coins[i].animator.updateAnimation(delta);
    }
  }

  // Game update based on given delta (time since last tick in ms)
  update = function(delta) {
    // Update objects
    updateObjects(delta);

    // Handle collisions
    handleCollisions();

    // Update game information (highscore, whether dragon firing)
    updateGame();

    // Update spawn information for peasants/knigths
    updateSpawnTimes(delta);

    // Update Achievements
    updateAchievements();

    // Update animations of obejcts
    updateAnimations(delta);
  }

  drawObjects = function() {
    // Draw background to canvas
    ctx.drawImage(backgroundImg, 0, 0);

    // If the game is over, draw the deadDragon sprite
    // Otherwise, draw the dragon in the respective orientation
    if(gameOver) drawSprite(dragonImgDead, dragon.entity);
    else if(dragon.facingLeft) {
      drawSpriteSheet(dragonSprite, dragon);
    }
    else {
      drawSpriteSheet(dragonSprite_flip, dragon);
    }

    // For every coin, draw it
    for(var i = 0; i < coins.length; i++) {
      drawSpriteSheet(coinSprite, coins[i]);
    }

    // For every peasant draw it in the respectice orientation
    for(var i = 0; i < peasants.length; i++) {
      if(peasants[i].facingLeft) {
        drawSpriteSheet(peasantSprite, peasants[i]);
      }
      else {
        drawSpriteSheet(peasantSprite_flip, peasants[i]);
      }
    }

    // For every knight draw it in the respectice orientation
    for(var i = 0; i < knights.length; i++) {
      if(knights[i].facingLeft) {
        drawSpriteSheet(knightSprite, knights[i]);
      }
      else {
        drawSpriteSheet(knightSprite_flip, knights[i]);
      }
    }

    // For every fireball, draw it
    for(var i = 0; i < fireballs.length; i++) {
      drawSpriteSheet(fireballSprite, fireballs[i]);
    }
  }

  drawUI = function() {
    // Black border around mana bar 
    ctx.fillStyle = 'black';
    ctx.fillRect(299, 569, 202, 27);

    // Set manabar color based on current mana
    if(dragon.mana < 50) ctx.fillStyle = '#994488';
    else ctx.fillStyle = '#66ccff';
    
    // Draw rectangle a proportional amount to dragon's mana
    ctx.fillRect(300, 570, Math.round(dragon.mana*2), 25);

    // Draw text over mana bar displaying "currMana/MaxMana"
    ctx.textAlign = "center"; 
    ctx.textBaseline = "middle"; 
    ctx.font = "24px 'Lucida Grande'";
    drawFancyText(
      Math.floor(dragon.mana) + "/" + Math.round(dragon.maxMana), 
      400, 
      583,
      '#DDFFEE');

    // Draw the dragons score at top left corner
    ctx.textAlign = "left"; 
    ctx.textBaseline = "top"; 
    drawFancyText("Score: "+Math.round(dragon.score), 5, 0, '#DDFFEE');

    // Draw the dragons score at top left corner
    ctx.textAlign = "right"; 
    ctx.textBaseline = "top"; 
    drawFancyText("Peasants Slain: "+peasantsSlain, 795, 0, '#DDFFEE');
    drawFancyText("Knights Slain: "+knightsSlain, 795, 25, '#DDFFEE');
    drawFancyText("Coins Collected: "+coinsCollected, 795, 50, '#DDFFEE');

    // If there is a new highscore, draw that. Otherwise display
    // the current highscore
    ctx.textAlign = "center"; 
    if(newHighscore) {
      drawFancyText("New Highscore!", 400, 0, '#aaff88');
    }
    else {
      drawFancyText("Highscore: "+Math.round(highscore), 400, 0, '#DDFFEE');
    }

    ctx.font = "16px 'Lucida Grande'";
    for(var i = 0; i < floatingText.length; i++) {
      ctx.textAlign = "center"; 
      ctx.textBaseline = "middle"; 
      drawFancyText(
        floatingText[i].text, 
        floatingText[i].x, 
        floatingText[i].y,
        '#ffdd00');//'#aaff88');
    }
    

    // If the game is paused, display the pause message
    if(paused) {
      ctx.textAlign = "center"; 
      ctx.textBaseline = "middle"; 
      ctx.font = "48px 'Lucida Grande'";
      drawFancyText("Paused", 400, 300, '#DDFFEE');
    }
    
    // If the game is over, display the gameover message
    if(gameOver) {
      ctx.textAlign = "center"; 
      ctx.textBaseline = "middle"; 
      ctx.font = "48px 'Lucida Grande'";
      drawFancyText("You have been slain.", 400, 260, '#ff4444');
      drawFancyText("Press R to play again!", 400, 340, '#ff4444');
    }
  }

  // Draw to canvas!
  draw = function() {
    // Clear screen
    ctx.clearRect(0, 0, 800, 600);

    // Draw objects (dragon, peasants, etc)
    drawObjects();

    // Draw UI (User Interface) (text, manabar)
    drawUI();
  }

  // Draw fancy text to canvas
  // Takes text to print and (x, y) coordinates with given color
  // Has black border by default
  drawFancyText = function(text, x, y, color) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  // Draw plain old lame static sprite
  // Takes an image to draw and an entity to base it on
  drawSprite = function(img, entity) {
    ctx.drawImage(
      img, 
      entity.x-entity.width/2, 
      entity.y-entity.height/2,
      entity.width,
      entity.height);
  }

  // Draw a sprite from a sprite sheet
  // Takes a spritesheet to draw from and object to base it on
  // Note: drawImage(image, sx, sy, sw, sh, x, y, w, h)
  // The s variables stand for source, so where on sprite sheet
  // other refer to canvas
  drawSpriteSheet = function(img, obj) {
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
  // We need to adjust it to proper (x', y') on the canvas
  // Also round cause some browsers have decimals... Sigh...
  getMousePos = function(x, y) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(x - rect.left), 
      y: Math.round(y - rect.top)
    };
  }

  // Start the game! Initialize and call game loop every 10 ms
  this.start = function() { 
    init();
    interval = setInterval(loop, 10);
  }
}

// Initialize a new game and start her up!
new Game("canvas").start();
