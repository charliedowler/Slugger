//Initial variables
var canvas, context;
var mouseX, mouseY;
var startButton = new Image();
var slugger = new Image();
var twitter = new Image();
var buttonHover = false;
var loaded = false;
var images = new Array();
var editor = false;
var totalResources = 18;
var numberOfResourcesLoaded = 0;
var menuSound = new Audio("SOUNDS/menu.mp3");
//I did have a little theme tune but it sounded bad
//var themeSound;
var start = false;
function replayTheme() {
//Play sound when sound finished - loopings
themeSound.play();
}
function init() {
//Setup canvas
canvas = document.getElementById("canvas");
context = canvas.getContext("2d");
/* 
Set up images for
-logo
-start button
-twitter
*/
slugger.src = "IMAGES/slugger.png";
twitter.src = "IMAGES/twitter.png";
startButton.src = "IMAGES/start1.png";
//Show menu
LoadMenu();
}
function LoadMenu() {
//Only display the menu if the game hasn't started
if (!start){
//Clear the canvas
context.clearRect(0, 0, canvas.width, canvas.height);
//Set the text colour to black
//Can't remember why as it isn't used in the actual menu
context.fillStyle = "#000";
//Setup font family
context.font = "24px arial";
//Detect when mouse is over the button
if (mouseX > canvas.width / 2 - startButton.width / 2 && mouseX < canvas.width / 2 + startButton.width / 2 && mouseY < canvas.height / 2 + startButton.height && mouseY > canvas.height / 2 - startButton.height / 4) {
//Change image when the user hovers over the button
startButton.src = "IMAGES/start2.png";
//If the user hovers over the button play a sound
//This stops the sound playing continuously while hovering
if (!buttonHover) {
//Play menu sound
menuSound.play();
//Your currently hovering - stops audio from playing
//until the mouse goes away and comes back
buttonHover = true;
//Listen for clicks to start the game
addEventListener("click", startGame, false);
}
}
else {
//If the mouse collision isn't detected then
//Your not hovering
buttonHover = false;
//Change the start button image back to the default one
startButton.src = "IMAGES/start1.png";
//Remove listener if mouse is away from button
removeEventListener("click", startGame, false);
}
//Draw logo
context.drawImage(slugger, canvas.width / 2 - slugger.width / 2, canvas.height / 4);
//Draw start button
context.drawImage(startButton, canvas.width / 2 - startButton.width / 2, canvas.height / 2);
//Draw twitter
context.drawImage(twitter, canvas.width / 2 - twitter.width / 2, canvas.height / 1.1);
//Loop back at 30 fps
setTimeout(LoadMenu, 1000 / 30);
}
}
function startGame() {
//Called when the user clicks start
//Start is true therefore the menu will disappear
start = true;
//Clear canvas before loading the game
context.clearRect(0, 0, canvas.width, canvas.height);
//Comment out all of the themeSound stuff for background music
//themeSound = document.getElementById("themeSound");
//themeSound.play();
//Start game by calling this function found in game.js
loadResources();
}
//Get mouse position
$(document).ready(function() {
	$("#canvas").mousemove(function(e) {
		mouseX = e.pageX - this.offsetLeft;
		mouseY = e.pageY - this.offsetTop;
	});
});