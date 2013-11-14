// Knight Class
// Takes no arguments since it spawns randomly
var Knight = function () {
  // Create an entity at random location
  this.entity = spawn();

  // Set speed randomly in [50, 80] (px/s)
  this.speed = Math.floor(Math.random()*31)+50;

  // Create an animator object with 2 sprites every 300ms
  this.animator = new Animator(2, 300);

  // Is the knight facing left? (Determines which spritesheet to use)
  this.facingLeft = false;

  // Health (fireball does 1 damage)
  this.hp = 3;

  // Update method to calculate new (x, y) and change direction if necessary
  // Takes the given dragons entity and a 
  // delta(change in time(ms) since last tick)
  this.update = function (dragonEntity, delta) {
    // calculate angle towards given dragon entity (simple trig)
    var angle = Math.atan2(
      this.entity.x-dragonEntity.x, 
      this.entity.y-dragonEntity.y);

    // velocity = speed*time(s)
    var v = this.speed*delta/1000;

    // Update (x, y)
    this.entity.x += v*Math.cos(angle+Math.PI/2);
    this.entity.y += v*Math.sin(angle-Math.PI/2);

    // Are we facing left or right?
    if(angle < 0) this.facingLeft = false;
    else this.facingLeft = true;
  }

  // returns a new Entity at random location on screen border
  function spawn() {
    // Knight width/height
    var width = 24;
    var height = 24;

    // Canvas is 800x600.
    // 800+600+800+600 = 2800 perimeter
    // seed gives number in [0,2800)
    // Traverse the edge of game starting at top left corner(0, 0) going 
    // clockwise. Go "seed" number of pixels then spawn there
    var seed = Math.floor(Math.random()*2800);
    if(seed <= 800) return new Entity(seed, 0, width, height);
    else if(seed <= 1400) return new Entity(800, seed-800, width, height);
    else if(seed <= 2200) return new Entity(2200-seed, 600, width, height);
    else  return new Entity(0, 2800-seed, width, height);
  }
}