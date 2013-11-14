var Coin = function(x, y) {
  this.entity = spawn(x, y);
  this.type = randomType();
  
  this.animRate = 100;
  this.animCurrFrame = 0;
  this.animFrames = 8;
  this.animTick = 0;

  function spawn(x, y) {
    var width = 16;
    var height = 16;

    return new Entity(x, y, width, height);
  }

  this.updateAnimation = function(delta) {
    if(this.animTick >= this.animRate) {
      this.animTick = this.animTick%this.animRate;
      this.animCurrFrame++;
      if(this.animCurrFrame >= this.animFrames) this.animCurrFrame = 0;
    }
    this.animTick += delta;
  }

  function randomType() {
    var r = Math.floor(Math.random()*3);
    return r;
  }
}

var Entity = function (x, y, width, height) {
  this.x = x;
  this.y = y;

  this.width = width;
  this.height = height;

  this.collide = function (entity) {
    return (
      this.x-this.width/2 <= entity.x+entity.width/2 &&
      this.x+this.width/2 >= entity.x-entity.width/2 &&
      this.y-this.height/2 <= entity.y+entity.height/2 &&
      this.y+this.height/2 >= entity.y-entity.height/2);
  }
}

var Peasant = function () {
  this.entity = spawn();
  this.speed = Math.floor(Math.random()*26)+100;
  this.facingLeft = false;
  this.hp = 1;
  
  this.animRate = 200;
  this.animCurrFrame = 0;
  this.animFrames = 2;
  this.animTick = 0;

  this.update = function (dragonEnt, delta) {
    var angle = Math.atan2(
      this.entity.x-dragonEnt.x, 
      this.entity.y-dragonEnt.y);

    var v = this.speed*delta/1000;

    this.entity.x += v*Math.cos(angle+Math.PI/2);
    this.entity.y += v*Math.sin(angle-Math.PI/2);

    if(angle < 0) this.facingLeft = false;
    else this.facingLeft = true;
  }

  this.updateAnimation = function(delta) {
    if(this.animTick >= this.animRate) {
      this.animTick = this.animTick%this.animRate;
      this.animCurrFrame++;
      if(this.animCurrFrame >= this.animFrames) this.animCurrFrame = 0;
    }
    this.animTick += delta;
  }

  function spawn() {
    var width = 20;
    var height = 20;

    var seed = Math.random()*2800;
    if(seed <= 800) return new Entity(seed, 0, width, height);
    else if(seed <= 1400) return new Entity(800, seed-800, width, height);
    else if(seed <= 2200) return new Entity(seed-1400, 600, width, height);
    else  return new Entity(0, seed-2200, width, height);
  }
}

var Knight = function () {
  this.entity = spawn();
  this.speed = Math.floor(Math.random()*31)+50;
  this.facingLeft = false;
  this.hp = 3;

  this.animRate = 300;
  this.animCurrFrame = 0;
  this.animFrames = 2;
  this.animTick = 0;

  this.update = function (dragonEnt, delta) {
    var angle = Math.atan2(
      this.entity.x-dragonEnt.x, 
      this.entity.y-dragonEnt.y);

    var v = this.speed*delta/1000;

    this.entity.x += v*Math.cos(angle+Math.PI/2);
    this.entity.y += v*Math.sin(angle-Math.PI/2);

    if(angle < 0) this.facingLeft = false;
    else this.facingLeft = true;
  }

  this.updateAnimation = function(delta) {
    if(this.animTick >= this.animRate) {
      this.animTick = this.animTick%this.animRate;
      this.animCurrFrame++;
      if(this.animCurrFrame >= this.animFrames) this.animCurrFrame = 0;
    }
    this.animTick += delta;
  }

  function spawn() {
    var width = 24;
    var height = 24;

    var seed = Math.random()*2800;
    if(seed <= 800) return new Entity(seed, 0, width, height);
    else if(seed <= 1400) return new Entity(800, seed-800, width, height);
    else if(seed <= 2200) return new Entity(seed-1400, 600, width, height);
    else  return new Entity(0, seed-2200, width, height);
  }
}

var Arrow = function() {
  // later
}

var Archer = function() {
  // later
}

var Fireball = function (x, y, angle) {
  this.entity = new Entity(x, y, 8, 8);
  this.speed = 750;
  this.dx = Math.cos(angle-Math.PI/2);
  this.dy = Math.sin(angle+Math.PI/2);
  
  this.animRate = 100;
  this.animCurrFrame = 0;
  this.animFrames = 4;
  this.animTick = 0;

  this.update= function (delta) {
    var v = this.speed*delta/1000;

    this.entity.x += v*this.dx;
    this.entity.y += v*this.dy;
  }

  this.updateAnimation = function(delta) {
    if(this.animTick >= this.animRate) {
      this.animTick = this.animTick%this.animRate;
      this.animCurrFrame++;
      if(this.animCurrFrame >= this.animFrames) this.animCurrFrame = 0;
    }
    this.animTick += delta;
  }
}

var Dragon = function() {
  this.entity = new Entity(400, 300, 46, 50);
  this.mousePos = { x:0, y:0 };
  this.speed = 150;

  this.maxMana = 100;
  this.mana = this.maxMana;

  this.magicFiring = false;
  this.tryToMagicFire = false;

  this.facingLeft = true;

  this.score = 0;
  
  this.firing = false;
  this.fireDelay = 400;
  this.currFireDelay = 0;

  this.animRate = 125;
  this.animCurrFrame = 0;
  this.animFrames = 4;
  this.animTick = 0;

  this.upPressed = false;
  this.downPressed = false;
  this.rightPressed = false;
  this.leftPressed = false;

  this.movingUp = false;
  this.movingDown = false;
  this.movingRight = false;
  this.movingLeft = false;

  this.coins = [];

  this.update = function (delta) {
    var v = this.speed*delta/1000;
    this.score += delta/200;

    this.movingUp = this.upPressed && !this.downPressed;
    this.movingDown = !this.upPressed && this.downPressed;
    this.movingLeft = this.leftPressed && !this.rightPressed;
    this.movingRight = !this.leftPressed && this.rightPressed;

    if(this.upPressed) {
      this.entity.y -= v;
    }
    else if(this.downPressed) {
      this.entity.y += v;
    }
    if(this.leftPressed) {
      this.entity.x -= v;
      this.facingLeft = true;
    }
    else if(this.rightPressed) {
      this.entity.x += v;
      this.facingLeft = false;
    }

    if(this.entity.x <= 0) this.entity.x = 0;
    else if(this.entity.x >= 800) this.entity.x = 800;
    if(this.entity.y <= 0) this.entity.y = 0;
    else if(this.entity.y >= 600) this.entity.y = 600;

    if(this.currFireDelay > 0) this.currFireDelay -= delta;

    this.mana += delta/1000;
    if(this.mana > 100) this.mana = 100;
  }

  this.updateAnimation = function(delta) {
    if(this.movingUp || this.movingDown ||
       this.movingLeft || this.movingRight) {
      if(this.animTick >= this.animRate) {
        this.animTick = this.animTick%this.animRate;
        this.animCurrFrame++;
        if(this.animCurrFrame >= this.animFrames) this.animCurrFrame = 0;
      }
      this.animTick += delta;
    }
  }

  this.updateMouse = function (pos){
    this.mousePos = pos;
  }

  this.fire = function () {
    var angle = Math.atan2(
      this.mousePos.x-this.entity.x, 
      this.mousePos.y-this.entity.y);

    this.currFireDelay = this.fireDelay;
    return new Fireball(this.entity.x, this.entity.y, angle);
  }

  this.magic = function () {
    var magicFireballs = [];
    for(var i = -180; i < 180; i += 5) {
      var angle = i*Math.PI/180;
      magicFireballs.push(new Fireball(this.entity.x, this.entity.y, angle));
    }

    this.mana -= 50;

    return magicFireballs;
  }
}

var Game = (function () {
  var canvas, ctx, dragon, fireballs, peasants, knights,
      peasantSpawnTime, currPeasantSpawnTime, minPeasantSpawnTime,
      knightSpawnTime, currKnightSpawnTime, minKnightSpawnTime,
      lastTime,
      coins, highscore, newHighscore,
      dragonSprite, fireballSprite, peasantSprite, coinSprite, backgroundImg,
      deadDragonImg,
      interval, gameOver;

  // constructor
  var self = function (id) {
    canvas = document.getElementById(id);
    ctx = canvas.getContext('2d');

    highscore = 1000;
    newHighscore = false;
    gameOver = false;

    backgroundImg = new Image();
    backgroundImg.src = "img/desert.png";

    dragonSprite = new Image();
    dragonSprite .src = "img/dragonSprite.png";

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

    reset();

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
    canvas.addEventListener('mousedown', function (e) {
      dragon.firing = true;
    });
    canvas.addEventListener('mouseup', function (e) {
      dragon.firing = false;
    });
    canvas.addEventListener('mousemove', function (e) {
      dragon.updateMouse(getMousePos(e.x, e.y));
    });

    lastTime = new Date().getTime();
  };

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

  var loop = function () {
    var newTime = new Date().getTime();
    var delta = newTime - lastTime;
    lastTime = newTime;
    if(!gameOver) { update(delta); }
    draw();  
  }

  var update = function (delta) {
    dragon.update(delta);
    dragon.updateAnimation(delta);

    if(dragon.score > highscore) {
      newHighscore = true;
    }

    if(dragon.firing && dragon.currFireDelay <= 0) {
      fireballs.push(dragon.fire()); 
    }
    if(dragon.tryToMagicFire && !dragon.magicFiring && dragon.mana >= 50) {
      dragon.magicFiring = true;

      fireballs = fireballs.concat(dragon.magic());
    }
    if(!dragon.tryToMagicFire) {
      dragon.magicFiring = false;
    }

    for(var i = 0; i < fireballs.length; i++) {
      fireballs[i].update(delta);
      fireballs[i].updateAnimation(delta);
      if(fireballs[i].entity.x < 0 || 
        fireballs[i].entity.x > 800 || 
        fireballs[i].entity.y < 0 || 
        fireballs[i].entity.y > 600) fireballs.splice(i, 1);
    }

    for(var i = 0; i < peasants.length; i++) {
      peasants[i].update(dragon.entity, delta);
      peasants[i].updateAnimation(delta);
    }

    for(var i = 0; i < knights.length; i++) {
      knights[i].update(dragon.entity, delta);
      knights[i].updateAnimation(delta);
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
          }
          fireballs.splice(j, 1);
          break;
        } 
      }
    }

    for(var i = 0; i < knights.length; i++) {
      if(knights[i].entity.collide(dragon.entity)) {
        gameOver = true;
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
          }
          fireballs.splice(j, 1);
          break;
        } 
      }
    }

    for(var i = 0; i < coins.length; i++) {
      coins[i].updateAnimation(delta);
      if(coins[i].entity.collide(dragon.entity)) {
        coins.splice(i, 1);
        dragon.score += 100;
      } 
    }
  }

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
    if(dragon.mana < 50) ctx.fillStyle = '994488';
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

  function drawFancyText(text, x, y) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = '#DDFFEE';
    ctx.fillText(text, x, y);
  }

  var drawSprite = function (img, entity) {
    ctx.drawImage(
      img, 
      entity.x-entity.width/2, 
      entity.y-entity.height/2,
      entity.width,
      entity.height);
  }

  var drawSpriteSheet = function(img, obj) {
    ctx.drawImage(
      img, 
      obj.animCurrFrame*obj.entity.width,
      0,
      obj.entity.width,
      obj.entity.height,
      obj.entity.x-obj.entity.width/2, 
      obj.entity.y-obj.entity.height/2,
      obj.entity.width,
      obj.entity.height);
  }

  var getMousePos = function (x, y) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(x - rect.left), 
      y: Math.round(y - rect.top)
    };
  }

  self.prototype = {
    constructor: self,
    start: function() { interval = setInterval(loop, 10) },
  };

  return self;
})();

var game = new Game("canvas");
game.start();
