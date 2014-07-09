// You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
var renderer = new PIXI.WebGLRenderer(800, 600);

document.body.appendChild(renderer.view);
var bunnyTexture = PIXI.Texture.fromImage("res/bunny.png");

var stage = new PIXI.Stage;

var ply = new PIXI.Sprite(bunnyTexture);
ply.position.x = 400;
ply.position.y = 300;
ply.scale.x = 2;
ply.scale.y = 2;
ply.nextFireTime = 0;
stage.addChild(ply);

var ents = new Array();

for(i = 0; i < 8; i++) {
	var ent = new PIXI.Sprite(bunnyTexture);
	ent.position.x = i*100;
	ent.position.y = 0;
	ent.velocity = {x: 0, y: 0.1};
	ent.scale.x = 4;
	ent.scale.y = 2;
	ents.push(ent);
	stage.addChild(ent);
}


function checkCollision(bullet) {
	console.log(ents.length);
	for(i = 0; i < ents.length; i++) {
		var ent = ents[i];
		if(ent == null || ent == bullet) {continue;}
		
		var maxX = Math.max(bullet.position.x, ent.position.x);
		var minX = Math.min(bullet.position.x + bullet.width, ent.position.x + ent.width);
		var maxY = Math.max(bullet.position.y, ent.position.y);
		var minY = Math.min(bullet.position.y + bullet.height, ent.position.y + ent.height);
		if(maxX < minX && maxY < minY) {return ent;}
	}
	return false;
}

function animate() {
	kd.tick();
	ply.rotation += 0.01;
	
	for(var i = 0; i < ents.length; i++) {
		var ent = ents[i];
		
		ent.position.x += ent.velocity.x;
		ent.position.y += ent.velocity.y;
	}
	
	for(var i = 0; i < bullets.length; i++) {
		var bullet = bullets[i];
		if(bullet == null) {continue;}
		
		var hit = checkCollision(bullet);
		
		if(hit != false) {
			ents.splice(ents.indexOf(hit), 1);
			stage.removeChild(hit);
			bullets.splice(bullets.indexOf(bullet), 1);
			ents.splice(ents.indexOf(bullet), 1);
			stage.removeChild(bullet);
		}
	}

	renderer.render(stage);

	requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

function moveAvatar(x, y) {
	ply.position.x += x;
	ply.position.y += y;
}

function moveUp(e) {
	moveAvatar(0, -4);
}
kd.UP.down(moveUp);

function moveDown(e) {
	moveAvatar(0, 4);
}
kd.DOWN.down(moveDown);

function moveLeft(e) {
	moveAvatar(-4, 0);
}
kd.LEFT.down(moveLeft);

function moveRight(e) {
	moveAvatar(4, 0);
}
kd.RIGHT.down(moveRight);

var bullets = [];

function fireBullet(e) {
	if(ply.nextFireTime > new Date().getTime()) {return;}
	ply.nextFireTime = new Date().getTime() + 500;

	var ent = new PIXI.Sprite(bunnyTexture);
	ent.position.x = ply.position.x;
	ent.position.y = ply.position.y - 50;
	ent.scale.x = 0.5;
	ent.scale.y = 2;
	ent.velocity = {x: 0, y: -5};
	stage.addChild(ent);
	bullets.push(ent);
	ents.push(ent);
}
kd.SPACE.down(fireBullet);
