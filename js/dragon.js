// Dragon Class
// Takes no arguments, spawns center of screen
var Dragon = function() {
  // Spawn at (400, 300) with width:46, height:50
  this.entity = new Entity(400, 300, 46, 50);

  // Position of mouse
  this.mousePos = { x:0, y:0 };

  // Set speed(px/s) of dragon
  this.speed = 150;

  // Create an animator object with 4 sprites every 100ms
  this.animator = new Animator(4, 125);

  // Mana used to cast the magic ring of fiery death
  this.maxMana = 100;
  this.mana = this.maxMana;

  // Is the dragon currently using the spell? Is he trying to?
  this.magicFiring = false;
  this.tryToMagicFire = false;

  // Is the knight facing left? (Determines which spritesheet to use)
  this.facingLeft = true;

  // Score!
  this.score = 0;
  
  // Is the dragon currently firing?
  this.firing = false;

  // Delay(ms) in between fireballs.
  this.fireDelay = 400;
  this.currFireDelay = 0;

  // Which buttons are currently being pressed
  this.upPressed = false;
  this.downPressed = false;
  this.rightPressed = false;
  this.leftPressed = false;

  // Which directions is the dragon moving
  this.movingUp = false;
  this.movingDown = false;
  this.movingRight = false;
  this.movingLeft = false;

  // Update method to calculate new (x, y) and change direction if necessary
  this.update = function(delta) {
    // velocity = speed*time(s)
    var v = this.speed*delta/1000;

    // Increase score by 1 every 200ms
    this.score += delta/200;

    // Based on key input, what direction is the dragon moving
    this.movingUp = this.upPressed && !this.downPressed;
    this.movingDown = !this.upPressed && this.downPressed;
    this.movingLeft = this.leftPressed && !this.rightPressed;
    this.movingRight = !this.leftPressed && this.rightPressed;

    // If moving up, move up
    if(this.movingUp) {
      this.entity.y -= v;
    }
    // If moving down, move down
    else if(this.movingDown) {
      this.entity.y += v;
    }
    // If moving left, move left and set direction to left
    if(this.movingLeft) {
      this.entity.x -= v;
      this.facingLeft = true;
    }
    // If moving right, move right and set direction to right
    else if(this.movingRight) {
      this.entity.x += v;
      this.facingLeft = false;
    }

    // If dragon off screen, put him back on!
    // Note: (x, y) is center of entity, not top left corner
    if(this.entity.x <= this.entity.width/2) {
      this.entity.x = this.entity.width/2;
    }
    else if(this.entity.x >= 800-this.entity.width/2) {
      this.entity.x = 800-this.entity.width/2;
    }
    if(this.entity.y <= this.entity.height/2) {
      this.entity.y = this.entity.height/2;
    }
    else if(this.entity.y >= 600-this.entity.height/2) {
      this.entity.y = 600-this.entity.height/2;
    }

    // If we still cant fire, decrease the current delay
    if(this.currFireDelay > 0) this.currFireDelay -= delta;

    // add 1 mana/s
    // Make sure it doesn't go over maxMana
    this.mana += delta/1000;
    if(this.mana > 100) this.mana = 100;
  }

  // Updates mouse position with given mouse position
  this.updateMouse = function(pos){
    this.mousePos = pos;
  }

  // Fire a fireball!
  this.fire = function() {
    // calculate angle towards mousePos (simple trig)
    var angle = Math.atan2(
      this.mousePos.x-this.entity.x, 
      this.mousePos.y-this.entity.y);

    // Reset the fire delay and return a Fireball object
    this.currFireDelay = this.fireDelay;
    return new Fireball(this.entity.x, this.entity.y, angle);
  }

  // Fire a magic ability
  // This basically fires 72 fireballs in a concentric circle
  // radiating from the dragon
  this.magic = function() {
    // New array of fireballs to emit
    var magicFireballs = [];

    // Generate 72 fireballs separated by 5 degree angle
    for(var i = -180; i < 180; i += 5) {
      var angle = i*Math.PI/180;
      magicFireballs.push(new Fireball(this.entity.x, this.entity.y, angle));
    }

    // Reduce mana
    this.mana -= 50;

    // Return the 72 fireballs
    return magicFireballs;
  }
}