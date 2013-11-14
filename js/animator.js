// Animator Class
// Takes a number of sprites and animation rate
var Animator = function(frames, rate) {
  	// Current frame. Always in [0, frames-1]
    this.animCurrFrame = 0;
    // Current tick. Used to determine when to change sprite
  	this.animTick = 0;
    // Rate at which animation occurs
  	this.animRate = rate;
    // Number of sprites in spritesheet
  	this.animFrames = frames;
  	
    // Every tick call this method to update animation
    // based on given delta, time elapsed in ms
  	this.updateAnimation = function(delta) {
      // Is the tick > rate? If so change current sprite
      if(this.animTick >= this.animRate) {
        this.animTick = this.animTick%this.animRate;
        this.animCurrFrame++;

        // Are we past our last sprite? Start over!
        if(this.animCurrFrame >= this.animFrames) this.animCurrFrame = 0;
    }
    // Update current tick
    this.animTick += delta;
  }
}