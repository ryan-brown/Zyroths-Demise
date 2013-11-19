// Entity Class
// Takes (x, y) coordinates and width, height of entity
// NOTE: (x, y) is the CENTER of the entity, not the top left corner
var Entity = function(x, y, width, height) {
  // set coordinates and width/height
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  // Check if this entity is colliding(bounding box collision)
  // with a given entity
  // Note: remember (x, y) is at the center of the entity
  this.collide = function(entity) {
    return (
      this.x-this.width/2 <= entity.x+entity.width/2 &&
      this.x+this.width/2 >= entity.x-entity.width/2 &&
      this.y-this.height/2 <= entity.y+entity.height/2 &&
      this.y+this.height/2 >= entity.y-entity.height/2);
  }
}