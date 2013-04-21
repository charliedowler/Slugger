//Set initial variables
var slug;
var pipe;
var winGame = false;
var amountOfStrawberries;
var points = 0;
var gravity = 10;
var velocitY = 0.5;
var weight = 1;
var slugSpeed = 4;
var isJump = false;
var slimes = new Array();
var stopLoop = false;
var shooting = false;
var gameOver = false;
var numOfSalt;
var coolDown = false;
var BGpos = 0;
var amountOfSlimeSplatter = 10;
var clicking = false;
var salt = new Array();
var slimeParticles = new Array();
var BGSpeed = 3;
var slimeParticlesStop = false;
var amountOfSplatter = 20;
var isRight = true;
var isLeft = false;
var disableJump = false;
var lostLife = false;
var remove = false;
var rmStraw = false, rmBlock = false, rmSalt = false, rmSaltball = false;
var soundPlaying = false;
var salt_ball = new Array();
var ballSpeed = 0.1;
var slimeSound = new Audio("SOUNDS/slime.mp3");
var jumpSound = new Audio("SOUNDS/jump.mp3");
var pointSound = new Audio("SOUNDS/point.mp3");
var pointSound2 = new Audio("SOUNDS/point.mp3");
var hurtSound = new Audio("SOUNDS/hurt.mp3");
var slimeMoveSound = new Audio("SOUNDS/slime_move.mp3");
var slimeMoveSound2 = new Audio("SOUNDS/slime_move_2.mp3");
var particles = new Array();
function loadResources() {
//Checks whether the loading variable is true or false
if (!loaded) {
context.clearRect(0, 0, canvas.width, canvas.height);
loadingImage = new Image();
loadingImage.src="IMAGES/loading.png";
context.drawImage(loadingImage, canvas.width / 2 - loadingImage.width / 2, canvas.height / 1.1);
//If loaded = false then loop through to try and load images
setTimeout(loadResources, 5000);
}
//Load images using the load image function
loadImage("block");
loadImage("heart");
loadImage("pipe");
loadImage("salt");
loadImage("salt_ball");
loadImage("saltMount");
loadImage("slime");
loadImage("slug_1");
loadImage("slug_2");
loadImage("slug_3");
loadImage("slug_4");
loadImage("slug_5");
loadImage("slug_6");
loadImage("strawberry");
loadImage("block_slime");
loadImage("block_slime2");
loadImage("block_slime3");
loadImage("mario pipe");
}
function loadImage(name) {
//Add new image into the images array
images[name] = new Image();
//Wait for the image to load
images[name].onload = function() {
//Add one more to total resources loaded
numberOfResourcesLoaded += 1;
//Run finish loading after each resource is loaded
finishedLoading();
};
//Set the image source location
images[name].src = "IMAGES/" + name + ".png";
}
function finishedLoading() {
//Check if number of loaded items is equal to the total number
if (numberOfResourcesLoaded === totalResources) {
//Create the slug object
slug = new Object(images["slug_1"], 140, 200, 32, 32);
//Create the pipe object (found at the end of the level)
pipe = new Object(images["mario pipe"], 3300, 200, 118, 150);
//Create the mountain of salt (not used in game)
saltMount = new Object(images["saltMount"], -600, 0, 300, 300);
//Create array to store blocks and locations
blocks = new Array();
//Create array to store strawberries and locations
strawberry = new Array();
//All block locations stored in an auto generated list
blocks[0] = new Object(images['block'], 62, 268, 32, 32);
blocks[1] = new Object(images['block'], 94, 268, 32, 32);
blocks[2] = new Object(images['block'], 126, 268, 32, 32);
blocks[3] = new Object(images['block'], 158, 268, 32, 32);
blocks[4] = new Object(images['block'], 190, 268, 32, 32);
blocks[5] = new Object(images['block'], 222, 268, 32, 32);
blocks[6] = new Object(images['block'], 254, 268, 32, 32);
blocks[7] = new Object(images['block'], 286, 268, 32, 32);
blocks[8] = new Object(images['block'], 318, 268, 32, 32);
blocks[9] = new Object(images['block'], 350, 268, 32, 32);
blocks[10] = new Object(images['block'], 421, 198, 32, 32);
blocks[11] = new Object(images['block'], 453, 198, 32, 32);
blocks[12] = new Object(images['block'], 485, 198, 32, 32);
blocks[13] = new Object(images['block'], 517, 198, 32, 32);
blocks[14] = new Object(images['block'], 549, 198, 32, 32);
blocks[15] = new Object(images['block'], 590, 126, 32, 32);
blocks[16] = new Object(images['block'], 622, 126, 32, 32);
blocks[17] = new Object(images['block'], 654, 126, 32, 32);
blocks[18] = new Object(images['block'], 686, 126, 32, 32);
blocks[19] = new Object(images['block'], 718, 126, 32, 32);
blocks[20] = new Object(images['block'], 411, 64, 32, 32);
blocks[21] = new Object(images['block'], 443, 64, 32, 32);
blocks[22] = new Object(images['block'], 475, 64, 32, 32);
blocks[23] = new Object(images['block'], 507, 64, 32, 32);
blocks[24] = new Object(images['block'], 215, 124, 32, 32);
blocks[25] = new Object(images['block'], 247, 124, 32, 32);
blocks[26] = new Object(images['block'], 844, 209, 32, 32);
blocks[27] = new Object(images['block'], 876, 209, 32, 32);
blocks[28] = new Object(images['block'], 908, 209, 32, 32);
blocks[29] = new Object(images['block'], 940, 209, 32, 32);
blocks[30] = new Object(images['block'], 972, 209, 32, 32);
blocks[31] = new Object(images['block'], 1045, 145, 32, 32);
blocks[32] = new Object(images['block'], 1173, 215, 32, 32);
blocks[33] = new Object(images['block'], 1205, 215, 32, 32);
blocks[34] = new Object(images['block'], 1237, 215, 32, 32);
blocks[35] = new Object(images['block'], 1269, 215, 32, 32);
blocks[36] = new Object(images['block'], 1301, 215, 32, 32);
blocks[37] = new Object(images['block'], 1390, 164, 32, 32);
blocks[38] = new Object(images['block'], 1472, 110, 32, 32);
blocks[39] = new Object(images['block'], 1504, 110, 32, 32);
blocks[40] = new Object(images['block'], 1536, 110, 32, 32);
blocks[41] = new Object(images['block'], 1568, 110, 32, 32);
blocks[42] = new Object(images['block'], 1600, 110, 32, 32);
blocks[43] = new Object(images['block'], 1638, 200, 32, 32);
blocks[44] = new Object(images['block'], 1670, 200, 32, 32);
blocks[45] = new Object(images['block'], 1750, 153, 32, 32);
blocks[46] = new Object(images['block'], 1782, 153, 32, 32);
blocks[47] = new Object(images['block'], 1814, 153, 32, 32);
blocks[48] = new Object(images['block'], 1846, 153, 32, 32);
blocks[49] = new Object(images['block'], 1878, 153, 32, 32);
blocks[50] = new Object(images['block'], 1910, 153, 32, 32);
blocks[51] = new Object(images['block'], 1942, 153, 32, 32);
blocks[52] = new Object(images['block'], 1974, 153, 32, 32);
blocks[53] = new Object(images['block'], 2006, 153, 32, 32);
blocks[54] = new Object(images['block'], 2038, 153, 32, 32);
blocks[55] = new Object(images['block'], 2131, 213, 32, 32);
blocks[56] = new Object(images['block'], 2163, 213, 32, 32);
blocks[57] = new Object(images['block'], 2195, 213, 32, 32);
blocks[58] = new Object(images['block'], 2227, 213, 32, 32);
blocks[59] = new Object(images['block'], 2259, 213, 32, 32);
blocks[60] = new Object(images['block'], 2323, 174, 32, 32);
blocks[61] = new Object(images['block'], 2355, 174, 32, 32);
blocks[62] = new Object(images['block'], 2387, 174, 32, 32);
blocks[63] = new Object(images['block'], 2419, 174, 32, 32);
blocks[64] = new Object(images['block'], 2451, 174, 32, 32);
blocks[65] = new Object(images['block'], 2517, 132, 32, 32);
blocks[66] = new Object(images['block'], 2549, 132, 32, 32);
blocks[67] = new Object(images['block'], 2581, 132, 32, 32);
blocks[68] = new Object(images['block'], 2613, 132, 32, 32);
blocks[69] = new Object(images['block'], 2645, 132, 32, 32);
blocks[70] = new Object(images['block'], 2659, 227, 32, 32);
blocks[71] = new Object(images['block'], 2691, 227, 32, 32);
blocks[72] = new Object(images['block'], 2723, 227, 32, 32);
blocks[73] = new Object(images['block'], 2755, 227, 32, 32);
blocks[74] = new Object(images['block'], 2787, 227, 32, 32);
blocks[75] = new Object(images['block'], 2846, 179, 32, 32);
blocks[76] = new Object(images['block'], 2878, 179, 32, 32);
blocks[77] = new Object(images['block'], 2910, 179, 32, 32);
blocks[78] = new Object(images['block'], 2942, 179, 32, 32);
blocks[79] = new Object(images['block'], 2974, 179, 32, 32);
blocks[80] = new Object(images['block'], 3030, 130, 32, 32);
blocks[81] = new Object(images['block'], 3109, 212, 32, 32);
blocks[82] = new Object(images['block'], 3141, 212, 32, 32);
blocks[83] = new Object(images['block'], 3208, 180, 32, 32);
//All srawberry locations stored in an auto generated list
strawberry[0] = new Object(images['strawberry'], 268, 89, 16, 16);
strawberry[1] = new Object(images['strawberry'], 450, 39, 16, 16);
strawberry[2] = new Object(images['strawberry'], 543, 40, 16, 16);
strawberry[3] = new Object(images['strawberry'], 481, 170, 16, 16);
strawberry[4] = new Object(images['strawberry'], 528, 157, 16, 16);
strawberry[5] = new Object(images['strawberry'], 572, 172, 16, 16);
strawberry[6] = new Object(images['strawberry'], 642, 85, 16, 16);
strawberry[7] = new Object(images['strawberry'], 692, 104, 16, 16);
strawberry[8] = new Object(images['strawberry'], 743, 77, 16, 16);
strawberry[9] = new Object(images['strawberry'], 888, 182, 16, 16);
strawberry[10] = new Object(images['strawberry'], 936, 168, 16, 16);
strawberry[11] = new Object(images['strawberry'], 1012, 176, 16, 16);
strawberry[12] = new Object(images['strawberry'], 1086, 121, 16, 16);
strawberry[13] = new Object(images['strawberry'], 1223, 179, 16, 16);
strawberry[14] = new Object(images['strawberry'], 1274, 190, 16, 16);
strawberry[15] = new Object(images['strawberry'], 1326, 177, 16, 16);
strawberry[16] = new Object(images['strawberry'], 1504, 87, 16, 16);
strawberry[17] = new Object(images['strawberry'], 1628, 54, 16, 16);
strawberry[18] = new Object(images['strawberry'], 1665, 167, 16, 16);
strawberry[19] = new Object(images['strawberry'], 1801, 118, 16, 16);
strawberry[20] = new Object(images['strawberry'], 1860, 114, 16, 16);
strawberry[21] = new Object(images['strawberry'], 1950, 131, 16, 16);
strawberry[22] = new Object(images['strawberry'], 2015, 81, 16, 16);
strawberry[23] = new Object(images['strawberry'], 2071, 125, 16, 16);
strawberry[24] = new Object(images['strawberry'], 2189, 173, 16, 16);
strawberry[25] = new Object(images['strawberry'], 2248, 186, 16, 16);
strawberry[26] = new Object(images['strawberry'], 2301, 163, 16, 16);
strawberry[27] = new Object(images['strawberry'], 2391, 154, 16, 16);
strawberry[28] = new Object(images['strawberry'], 2474, 140, 16, 16);
strawberry[29] = new Object(images['strawberry'], 2576, 101, 16, 16);
strawberry[30] = new Object(images['strawberry'], 2623, 101, 16, 16);
strawberry[31] = new Object(images['strawberry'], 2676, 81, 16, 16);
strawberry[32] = new Object(images['strawberry'], 2689, 206, 16, 16);
strawberry[33] = new Object(images['strawberry'], 2776, 202, 16, 16);
strawberry[34] = new Object(images['strawberry'], 2741, 197, 16, 16);
strawberry[35] = new Object(images['strawberry'], 2909, 140, 16, 16);
strawberry[36] = new Object(images['strawberry'], 3069, 97, 16, 16);
strawberry[37] = new Object(images['strawberry'], 3172, 184, 16, 16);
strawberry[38] = new Object(images['strawberry'], 2982, 143, 16, 16);
strawberry[39] = new Object(images['strawberry'], 20, 205, 16, 16);
strawberry[40] = new Object(images['strawberry'], 1133, 178, 16, 16);
strawberry[41] = new Object(images['strawberry'], 1419, 114, 16, 16);
strawberry[42] = new Object(images['strawberry'], 2111, 166, 16, 16);
strawberry[43] = new Object(images['strawberry'], 3095, 173, 16, 16);
strawberry[44] = new Object(images['strawberry'], 3229, 131, 16, 16);
//All salt block locations stored in an auto generated list
salt[0] = new Object(images['salt'], 231, 260, 32, 8);
salt[1] = new Object(images['salt'], 227, 116, 32, 8);
salt[2] = new Object(images['salt'], 483, 56, 32, 8);
salt[3] = new Object(images['salt'], 1577, 101, 32, 8);
salt[4] = new Object(images['salt'], 1893, 145, 32, 8);
salt[5] = new Object(images['salt'], 2217, 205, 32, 8);
salt[6] = new Object(images['salt'], 2427, 166, 32, 8);
salt[7] = new Object(images['salt'], 2950, 172, 32, 8);
//All salt ball locations stored in an auto generated list
salt_ball[0] = new Object(images['salt_ball'], 264.0800000000072, 255.08000000000752, 8, 8);
salt_ball[1] = new Object(images['salt_ball'], 296.5000000000555, 68.49999999999733, 8, 8);
salt_ball[2] = new Object(images['salt_ball'], 850.9399999999728, 70.94000000000113, 8, 8);
salt_ball[3] = new Object(images['salt_ball'], 490, 114, 8, 8);
salt_ball[4] = new Object(images['salt_ball'], 1189, 40, 8, 8);
salt_ball[5] = new Object(images['salt_ball'], 1551, 219, 8, 8);
salt_ball[6] = new Object(images['salt_ball'], 1917, 38, 8, 8);
salt_ball[7] = new Object(images['salt_ball'], 2223, 118, 8, 8);
salt_ball[8] = new Object(images['salt_ball'], 2578, 84, 8, 8);
salt_ball[9] = new Object(images['salt_ball'], 3126, 260, 8, 8);
//Set a variable of the amount of strawberries, uses .length - makes it easier later
amountOfStrawberries = strawberry.length;
//Store hearts in an array to easily add and subtract lives
hearts = new Array();
for (i = 0; i < 3; i++) {
//Add three hearts each 32 pixels away from the previous one
hearts[i] = new Object(images['heart'], i * 32 + 500, 5, 32, 32);
}
//Game is loaded so listen for key presses
loaded = true;
window.addEventListener("keydown", function(event) {Key.onKeydown(event);}, false);
window.addEventListener("keyup", function(event) {Key.onKeyup(event);}, false);
//Start game
playGame();
}
}
var Key = {
  //Store all pressed keys into an array
  _pressed: {},
  //Key codes for each key used
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE:32,
  S: 83,
  Z: 90,
  E: 69,
  //When key is down add key code into array
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  //Set pressed as true, used in if statements - if (Key.isDown(Key.SPACE)) {}
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  //Onkeyup remove keypress from array
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  //Reset some variables
  //Shooting slimeballs
	shooting = false;
  //Removing objects
	remove = false;
  //Make sure only 1 object is placed until stopLoop = true
  stopLoop = false;
  //Stop particle effect on key up - To stop more lag
  slimeParticlesStop = false;
  }
};
//Create function for Object which takes in 5 parameters
function Object(res, x, y, width, height) {
//Set image resource - Equals images['imagename']
this.Sprite = res;
//Set x and y of object
this.x = x;
this.y = y;
//Set velocity for salt ball x and y - Only used for salt ball
this.ballSpeedX =.01;
this.ballSpeedY =.04;
//Sets the previous x and y for resetting the objects
this.PrevX = x;
this.PrevY = y;
//Set width and height, used for collision detection
this.width = width;
this.height = height;
//Jump height = object height / 2.5 - Playing around with the jump height and this seems like the best way
this.jumpHeight = height / 2.5;
//Used for blocks to check whether they have been changed into the slime sprite
this.changed = false;
//Collision detection, usage: slug.isCollide(block) - returns true or false depending on collision
this.isCollide = function(obj) {
if (this.x > obj.x + obj.width) return false;
if (this.x + this.width < obj.x) return false;
if (this.y > obj.y + obj.height) return false;
if (this.y + this.height < obj.y) return false;
return true;
};
}
function playGame() {
//Clear canvas to be redrawn
context.clearRect(0, 0, canvas.width, canvas.height);
//Check if player has won the game before re-rendering everything
if (!winGame) {
//Loop through all particles to draw them
for (i in particles) {
  particles[i].Create();
}
//Loop through particles and remove them from the array to free up space
for (i in particles) {
  if (particles[i].r > 4 || particles[i].x < 0 || particles[i].x > canvas.width || particles[i].y < 0 || particles[i].y > canvas.height) {particles.splice(i, 1);}
}
//Loop through slime particles and remove them from the array to free up space
for (i in slimeParticles) {
  if (slimeParticles[i].r > 4 || slimeParticles[i].x < 0 || slimeParticles[i].x > canvas.width || slimeParticles[i].y < 0 || slimeParticles[i].y > canvas.height) {slimeParticles.splice(i, 1);}
}
//Check whether hearts = 0, if true reset the game
if (hearts.length === 0) {
//Reset all x and y variables to the previous one
slug.y = slug.PrevY;pipe.x = pipe.PrevX;for (i in blocks) { blocks[i].x = blocks[i].PrevX;}for (i in strawberry) {strawberry[i].x = strawberry[i].PrevX;}for (i in salt) {salt[i].x = salt[i].PrevX;}
//On death half the points
points /= 2;
//Round up the points
points = Math.round(points);
//Add three hearts back into the array
for (i = 0; i < 3; i++) {
hearts.push(hearts[i] = new Object(images['heart'], i * 32 + 500, 5, 32, 32));
//I found a bug where it went over 3 so I added this to check and remove extra hearts
if (hearts.length > 3) hearts.pop();
}
}
/*
-Used to create levels
-Each rm variable means remove
-These variables have to be set to true from the console to work
-All are false by default
-If true where ever the user clicks will place either a
 -strawberry
 -salt pile
 -block
 -salt ball
-On mouse up stop loop (makes sure only one object can be placed at a time)
*/
if (editor && !stopLoop) {
if (rmStraw) {
window.addEventListener("click", function() {for (i = 0; i < 1; i++ ) { if (!clicking) { strawberry.push(new Object(images["strawberry"], mouseX - 8 , mouseY - 8, 16, 16));clicking = true;};}console.log("X: " + mouseX + "|Y: " + mouseY);}, false);
}
if (rmBlock) {
window.addEventListener("click", function() {for (i = 0; i < 1; i++ ) { if (!clicking) { blocks.push(new Object(images["block"], i *32 + mouseX - 16, mouseY - 16, 32, 32));clicking = true;};}console.log("X: " + mouseX + "|Y: " + mouseY);}, false);
}
if (rmSalt) {
window.addEventListener("click", function() {for (i = 0; i < 1; i++ ) { if (!clicking) { salt.push(new Object(images["salt"], mouseX - 4, mouseY - 8, 32, 8));clicking = true;};}console.log("X: " + mouseX + "|Y: " + mouseY);}, false);
}
if (rmSaltball) {
window.addEventListener("click", function() {for (i = 0; i < 1; i++ ) { if (!clicking) { salt_ball.push(new Object(images["salt_ball"], mouseX - 4, mouseY - 4, 8, 8));clicking = true;};}console.log("X: " + mouseX + "|Y: " + mouseY);}, false);
}
window.addEventListener("mouseup", function() {clicking = false;}, false);
stopLoop = true;
}
//Deal with key events
//E key means edit, this has to be pressed to enable edit mode
if (Key.isDown(Key.E)) {editor = true;}
//If right key is pressed set right to true and left to false (changes slug sprite)
if (Key.isDown(Key.RIGHT)) {
isLeft = false;
isRight = true;
//Move background image backwards (x position)
BGpos -= BGSpeed;
//Apply new location to css - CSS saves rendering a background image
document.getElementById("canvas").setAttribute("style", "background-position: " + BGpos);
//Sent blocks backwards
for (i in blocks) {
blocks[i].x -=slugSpeed;
}
//Send strawberries backwards
for (i in strawberry) {
strawberry[i].x -=slugSpeed;
}
//Send salt backwards
for (i in salt) {
salt[i].x -=slugSpeed;
}
//Send salt ball backwards
for (i in salt_ball) {
salt_ball[i].x -=slugSpeed;
}
//Send particles backwards
for (i in particles) {
  particles[i].x -=slugSpeed;
}
//Send slime particles backwards
for (i in slimeParticles) {
slimeParticles[i].x -= slugSpeed;
}
//Move pipe backwards (end of game)
pipe.x -= slugSpeed;
//Move salt mountain (not used in game)
//saltMount.x -= slugSpeed;
}
//deal with left key
//Everything is exactly the same as the right key but in the opposite direction
//Don't think this needs commenting!
if (Key.isDown(Key.LEFT)) {
isRight = false;
isLeft = true;
BGpos += BGSpeed;
document.getElementById("canvas").setAttribute("style", "background-position: " + BGpos);
for (i in blocks) {
blocks[i].x +=slugSpeed;
}
for (i in strawberry) {
strawberry[i].x +=slugSpeed;
}
for (i in salt_ball) {
salt_ball[i].x +=slugSpeed;
}
for (i in salt) {
salt[i].x +=slugSpeed;
}
for (i in particles) {
particles[i].x +=slugSpeed;
}
for (i in slimeParticles) {
slimeParticles[i].x += slugSpeed;
}
pipe.x += slugSpeed;
saltMount.x += slugSpeed;
}
//Only let player jump if it isn't disabled
if (!disableJump) {
//Check whether space key is pressed
//Make sure isJump is false - stops holding down the space button and flying of the canvas
if (Key.isDown(Key.SPACE) && !isJump) {
//Subtract jump height from velocity
velocitY -=slug.jumpHeight;
//Play jump sound
jumpSound.play();
//If user is heading right then display 'right' sprite
if (isRight) {
slug.Sprite = images["slug_3"];
}
//If user is heading left then display 'left' sprite
if (isLeft){
slug.Sprite = images["slug_6"];
}
//Set isJump = true
isJump = true;
//Sound playing = false
//When the player jumps we need to stop slime sound playing - when the slug goes over blocks
soundPlaying = false;
}
}
//S is the shooting key - Shooting works but there is nothing to shoot :O
if (Key.isDown(Key.S) && !shooting) {
//Shooting = true - Stops player holding down s key to shoot
shooting = true;
//Play sound of slimeball firing
slimeSound.play();
//Depending on direction fire slimeball that way
if (isRight) {
//Pass in right
slimes.push(new slimeBall("right"));
}
if (isLeft) {
//Pass in left
slimes.push(new slimeBall("left"));
}
}
//Z is the key to remove the last placed object - used for the editor
if (Key.isDown(Key.Z) && !remove) {
//Remove last placed strawberry
if (rmStraw) {
strawberry.pop();
}
//Remove last placed block
if(rmBlock){
blocks.pop();
}
//Remove last placed salt pile
if(rmSalt){
salt.pop();
}
//Remove last placed salt ball
if(rmSaltball){
salt_ball.pop();
}
//Stops user holding down z to to remove objects
remove = true;
}
//If slug is not jumping and heading right then set sprite to 'right'
if (isRight && !isJump) slug.Sprite = images["slug_1"];
//If slug is not jumping and heading left then set sprite to 'left'
if (isLeft && !isJump) slug.Sprite = images["slug_4"];
//Loop through and create slime balls
for (i in slimes) {
//Run drawing method
slimes[i].Create();
//Remove from array if hits end of canvas - Stops lag
if (slimes[i].x > canvas.width || slimes[i].x < 0) slimes.splice(i, 1);
}
//Keep adding to gravity until it reaches terminal velocity
if (velocitY < gravity) { velocitY += weight; }
//Add velocity to slug
slug.y += velocitY;
//If the slug falls out of the canvas reset the game
if (slug.y > canvas.height) {reset();}
for (i in blocks){
//Check for collision with block - had to play around with it to stop the objects locking together
if (slug.isCollide(blocks[i]) && slug.y + slug.height / 2 < blocks[i].y){slug.y = blocks[i].y - blocks[i].height;velocitY = 0;isJump = false;disableJump = false;if (!soundPlaying) {randomSound();soundPlaying = true;}if (Key.isDown(Key.LEFT) || Key.isDown(Key.RIGHT)) {randomSound();}if (!blocks[i].changed) {randomBlock(i);blocks[i].changed = true;}
    //Stops a continuous flow of particles
    if (!slimeParticlesStop) {
    //Create specific amount of particles
     for (i = 0; i< amountOfSlimeSplatter; i++) {
     //Push new particle to array
     slimeParticles.push(new particleSlime);
     }
     slimeParticlesStop = true;
    }
  }
// Stops the slug from jumping through the bottom of the block
if (slug.isCollide(blocks[i]) && slug.y > blocks[i].y) {
// Move slug to block.y + block.height to stop falling through blocks
slug.y = blocks[i].y + blocks[i].height;
}
//Loop through salt balls
for (o in salt_ball) {
//Only check for collision if slug hasn't been hit for 2 seconds
if (slug.isCollide(salt_ball[o]) && !coolDown) {
    //On hit remove salt_ball from array - as the game
    //goes on there will be less and less salt balls as the slug hits them
    salt_ball.splice(o, 1);
    //Play hurt sound
    hurtSound.play();
    //Set cooldown to true to stop collision after being hit
    coolDown = true;
    //Remove a life
    hearts.pop();
    //If the player has enough hearts not to be reset then create blood particles
    if (hearts.length !== 0) {
    for (i = 0; i< amountOfSplatter; i++) {
    //Push blood particles into array
    particles.push(new particle);
    }
    }
    //Wait 2 seconds and change cooldown to false
    setTimeout(function() {coolDown = false;}, 2000);
  }
//Add velocity to salt balls
if (salt_ball[o] !== undefined && salt_ball[o] !== undefined){
salt_ball[o].x += salt_ball[o].ballSpeedX;
salt_ball[o].y += salt_ball[o].ballSpeedY;
//Reverse velocity if the balls hit the edge of the canvas
if (salt_ball[o].y < 0 || salt_ball[o].y > canvas.height) {
  //Reverse velocity
  salt_ball[o].ballSpeedY = -salt_ball[o].ballSpeedY;
}
}
}
}
for (i in salt) {
  //Only check for collision if slug hasn't been hit for 2 seconds
  if (slug.isCollide(salt[i]) && !coolDown) {
    //Play hurt sound
    hurtSound.play();
    //Set cooldown to true to stop collision after being hit
    coolDown = true;
    //Remove a life
    hearts.pop();
    //If the player has enough hearts not to be reset then create blood particles
    if (hearts.length !== 0) {
    for (i = 0; i< amountOfSplatter; i++) {
     //Push blood particles into array
     particles.push(new particle);
    }
    }
    //Wait 2 seconds and change cooldown to false
    setTimeout(function() {coolDown = false;}, 2000);
  }
}
//If slug collides with the pipe
if (slug.isCollide(pipe) && slug.y < pipe.y) {
//Win game! :)
winGame = true;
}
for (i in strawberry) {
if (slug.isCollide(strawberry[i])) {
strawberry.splice(i, 1);
points += 1;
}
}
//render
if (coolDown) {
setTimeout(function() {
context.drawImage(slug.Sprite, slug.x, slug.y);
}, 50);
}
else {
context.drawImage(slug.Sprite, slug.x, slug.y);
}
context.drawImage(pipe.Sprite, pipe.x, pipe.y);
for (i in salt_ball) {
if (salt_ball[i].x + salt_ball[i].width > 0 || salt_ball[i].x < canvas.width) {
context.drawImage(salt_ball[i].Sprite, salt_ball[i].x, salt_ball[i].y);
}
}
for (o in salt) {
if (salt[o].x + salt[o].width > 0 || salt[o].x < canvas.width){
context.drawImage(salt[o].Sprite, salt[o].x, salt[o].y);
}
}
for (i in blocks) {
if (blocks[i].x + blocks[i].width > 0 || blocks[i].x < canvas.width) {
context.drawImage(blocks[i].Sprite, blocks[i].x, blocks[i].y);
}
}
for (i in strawberry) {
if (strawberry[i].x + strawberry[i].width > 0 || strawberry[i].x < canvas.width) {
context.drawImage(strawberry[i].Sprite, strawberry[i].x, strawberry[i].y);
}
}
for (i in hearts) {
context.drawImage(hearts[i].Sprite, hearts[i].x, hearts[i].y);
}
for (i in slimeParticles) {
  slimeParticles[i].Create();
}
/*
I started adding a salt mountain that chased the player but I felt
it ruined the game so I just commented it out if I ever wanted to
come back to it
------------------------------------------------------------------
saltMount.x += slugSpeed / 2;
context.beginPath();
context.rect(saltMount.x - saltMount.width * 2, saltMount.y, saltMount.width * 2, saltMount.height);
context.fillStyle = "#fff";
context.fill();
context.drawImage(saltMount.Sprite, saltMount.x, saltMount.y);
*/
//Draw to the top right of the canvas a message with the amount of strawberries collected
context.fillStyle="#fff";
context.font="24px arial";
//Displayed as: collected+'/'+total
context.fillText("Collected: " + points + "/" + amountOfStrawberries, 10, 25);
//Loop back to the beginning - runs at 60 fps
setTimeout(playGame, 1000 / 60);
}
//If the player has won the game then clear the canvas and display a message
if (winGame) {
context.clearRect(0, 0, canvas.width, canvas.height);
//Start drawing
context.beginPath();
//Align text to center
context.textAlign = "center";
//Set font size to 24px and arial font
context.font = "24px Arial";
//If the points are greater than half of the total points available then
//say the the player is great
if (points > amountOfStrawberries / 2) {
context.fillText("Your awesome! Ever thought of turning pr0?", canvas.width / 2, canvas.height / 2);
context.fillText("You got " + points + "/" + amountOfStrawberries, canvas.width / 2, canvas.height / 2 + 40);
}
//If the points are less than the total points / 2 then tell the
//player they're terrible
if (points < amountOfStrawberries / 2) {
context.fillText("You do know how to use a computer right?", canvas.width / 2, canvas.height / 2);
context.fillText("You got " + points + "/" + amountOfStrawberries, canvas.width / 2, canvas.height / 2 + 40);
}
}
}
//Blood particles
//Set initial variables
function particle() {
  this.offSetX = Math.round(Math.random()*32)+1;
  this.offSetY = Math.round(Math.random()*32)+1;
  this.x = slug.x + this.offSetX;
  this.y = slug.y + this.offSetY;
  this.grav = 20;
  this.weight = 0.1;
  this.r = Math.floor(Math.random()*4)+1;
  this.velY = -3;
  this.velX = Math.floor(Math.random()*5) - 2.5;
  this.circle = Math.random()*Math.PI*1.5;
}
//Apply create method to all particles to
//give particles velocity and draw particle
particle.prototype.Create = function() {
//Apply gravity
if (this.velY < this.grav) this.velY += this.weight;
//Add y velocity
this.y += this.velY;
//Add x velocity
this.x += this.velX;
//Keep adding to the radius - cool effect
//Each particle has a random radius so it gives
//a 3d effect
this.r += .01;
context.beginPath();
//Set colour to red
context.fillStyle = "red";
//Draw blood
context.arc(this.x, this.y, this.r, 0, this.circle, false);
context.fill();
};
//Set initial variables for slime particle
function particleSlime() {
  this.x = slug.x + 16;
  this.y = slug.y + 32;
  this.grav = 20;
  this.weight = 0.1;
  this.r = Math.floor(Math.random()*4)+1;
  this.velY = -1;
  this.velX = Math.floor(Math.random()*5) - 2.5;
  this.circle = Math.random()*Math.PI*1.1;
}
particleSlime.prototype.Create = function() {
//Apply gravity
if (this.velY < this.grav) this.velY += this.weight;
//Add y velocity
this.y += this.velY;
//Add x velocity
this.x += this.velX;
//Keep adding to the radius - cool effect
//Each particle has a random radius so it gives
//a 3d effect
this.r += .01;
context.beginPath();
//Set colour to green
context.fillStyle = "green";
//Draw slime particle
context.arc(this.x, this.y, this.r, 0, this.circle, false);
context.fill();
};
//Function from slimeball - passes in direction
function slimeBall(dir) {
//Set direction for slimeball
this.dir = dir;
//Set sprite for slimeball
this.Sprite = images["slime"];
//Depending on the direction set location of ball
//With this it looks like it comes from the 
//front of the slug either way
if (this.dir === "left") {
this.x = slug.x + slug.width / 5;
this.y = slug.y + slug.height / 2;
}
else {
this.x = slug.x + slug.width / 1.5;
this.y = slug.y + slug.height / 2;
}
}
//Apply create method to slimeBalls
//Draws slimeballs
slimeBall.prototype.Create = function() {
//Send slimeballs right
if (this.dir === "right") this.x += 5;
//Send slimeballs left
if (this.dir === "left") this.x -= 5;
//Draw image to canvas
context.drawImage(this.Sprite, this.x, this.y);
};
function reset() {
//Play hurt sound
hurtSound.play();
//On reset - lose life
for (i in hearts) {
if (!lostLife) {
lostLife = true;
hearts.pop();
}
}
//Reset slug.y position to y - default
slug.y = 100;
//Loop through all objects and set the positions to the previous one
for (i in blocks) {
blocks[i].x = blocks[i].PrevX;
}
for (i in strawberry) {
strawberry[i].x = strawberry[i].PrevX;
}
for (i in salt) {
salt[i].x = salt[i].PrevX;
}
for (i in salt_ball) {
salt_ball[i].x = salt_ball[i].PrevX;
}
pipe.x = pipe.PrevX;
saltMount.x = saltMount.PrevX;
lostLife = false;
}
//Function for changing a block to the slime sprite
function randomBlock(i) {
  //Generate a random number between 0 and 2
  ran = Math.floor(Math.random()*3);
  //Pass in ran to switch statement
  //Stops slime blocks from being repetitive
  switch(ran) {
    case 0:
    blocks[i].Sprite = images["block_slime"];
    break;
    case 1:
    blocks[i].Sprite = images["block_slime2"];
    break;
    case 2:
    blocks[i].Sprite = images["block_slime3"];
    break;
  }
}
//Play random sound - stops a repetitive sound which sounded weird
function randomSound() {
  //Generate random number
  ran = Math.floor(Math.random()*2);
  //Play a different sounds
  switch(ran) {
    case 0:
    slimeMoveSound.play();
    break;
    case 1:
    slimeMoveSound2.play();
    break;
  }
}
/*
Here are the level editor functions
If you type one of these functions into the chrome developer
console it will display a list of positions for all
-blocks
-strawberries
-salt piles
-salt balls
I wasn't sure how to make a better level editor so this
is the best I could come up with
*/
function lsBlocks() {
for (i in blocks) {
document.write("blocks[" + [i] + "] = new Object(images['block'], " + blocks[i].x + ", " + blocks[i].y + ", " + blocks[i].width + ", " + blocks[i].height + ");<br>");
}
}
function lsStraw() {
for (i in strawberry) {
document.write("strawberry[" + [i] + "] = new Object(images['strawberry'], " + strawberry[i].x + ", " + strawberry[i].y + ", " + strawberry[i].width + ", " + strawberry[i].height + ");<br>");
}
}
function lsSalt() {
for (i in salt) {
document.write("salt[" + [i] + "] = new Object(images['salt'], " + salt[i].x + ", " + salt[i].y + ", " + salt[i].width + ", " + salt[i].height + ");<br>");
}
}
function lsSaltBall() {
for (i in salt_ball) {
document.write("salt_ball[" + [i] + "] = new Object(images['salt_ball'], " + salt_ball[i].x + ", " + salt_ball[i].y + ", " + salt_ball[i].width + ", " + salt_ball[i].height + ");<br>");
}
}