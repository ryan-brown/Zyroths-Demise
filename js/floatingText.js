// FloatingText Class
// Takes an entity(position to spawn) and points
var FloatingText = function(entity, text) {
	// Set (x, y) same as given entity
	this.x = entity.x;
	this.y = entity.y;

	// Set points and default lifetime of 1 second
	this.text = text;
	this.time = 1;

	// Update time given delta and make y move up at 50px/sec
	this.update = function(delta) {
		this.y -= 50*delta/1000
		this.time -= delta/1000;
	}
}