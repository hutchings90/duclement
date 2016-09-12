const MAX_FLYING_OBJECTS = 15;
const CLOUD_COUNT = 5;
const PLANE_COUNT = 5;
const DUCK_COUNT = MAX_FLYING_OBJECTS - PLANE_COUNT - CLOUD_COUNT;

var _W = window.innerWidth;
var planes, clouds, explosions, ducks, scoreboard, score, planeHits, duckHits, misses, usedNumbers, timer, moveInterval, countDownInterval, gameOver;

function moveObjects(array){
	for(var i = 0; i < array.childNodes.length; i++){
		var leftString = array.childNodes[i].style.left;
		var left = Number(leftString.substr(0, leftString.length - 2)) + array.childNodes[i].speed;
		if(left >= _W - array.childNodes[i].width){
			left = 0;
			array.childNodes[i].speed = Math.floor(Math.random() * array.childNodes[i].range + array.childNodes[i].min);
			array.childNodes[i].style.top = 0 - Math.floor(Math.random() * 200 + 200) + "px";
		}
		array.childNodes[i].style.left = left + "px";
	}
}

function move(){
	moveObjects(clouds);
	moveObjects(planes);
	moveObjects(ducks.array);
}

function removeExplosion(explosion){
	explosions.removeChild(explosion);
	clearInterval(explosion.interval);
	if(gameOver == true) return;
	if(explosion.type == "plane"){
		makePlane();
		return;
	}
	makeElement(ducks.array, "img/duclement.png", 3, 1);
}

function destroyPlane(number){
	var audio = new Audio();
	var explosion = document.createElement('img');
	explosion.src = "img/explosion.png";
	explosion.style.visibility = "visible";
	explosion.style.position = "absolute";
	for(var i = 0; i < planes.childNodes.length; i++){
		if(planes.childNodes[i].number == number){
			explosion.style.top = planes.childNodes[i].style.top;
			explosion.style.left = planes.childNodes[i].style.left;
			explosion.type = "plane";
			explosions.appendChild(explosion);
			explosions.lastChild.interval = setInterval(function(){removeExplosion(explosion);}, 750);
			usedNumbers.splice(usedNumbers.indexOf(planes.childNodes[i].number), 1);
			planes.removeChild(planes.childNodes[i]);
			planeHits.innerHTML++;
			score.innerHTML++
			audio.src = "snd/explosion.mp3";
			audio.play();
			return;
		}
	}
	if(ducks.array.childNodes.length > 0){
		score.innerHTML = Number(score.innerHTML) - 2;
		if(score.innerHTML < 0) score.innerHTML = 0;
		duckHits.innerHTML++;
		if(ducks.index >= ducks.array.childNodes.length) ducks.index = 0;
		explosion.style.top = ducks.array.childNodes[ducks.index].style.top;
		explosion.style.left = ducks.array.childNodes[ducks.index].style.left;
		explosion.type = "duck";
		explosions.appendChild(explosion);
		explosion.interval = setInterval(function(){removeExplosion(explosion);}, 750);
		ducks.array.removeChild(ducks.array.childNodes[ducks.index]);
		audio.src = "snd/quack.mp3";
		audio.play();
		return;
	}
	misses.innerHTML++;
	if(score.innerHTML > 0) score.innerHTML--;
}

document.onkeyup = function(ev){
	if(gameOver == true) return;
	if(ev.key.search("[^0-9]") != -1) return;
	switch(ev.key){
		case "0": 
		case "1": 
		case "2": 
		case "3": 
		case "4": 
		case "5": 
		case "6": 
		case "7": 
		case "8": 
		case "9": destroyPlane(Number(ev.key)); break;
	}
}

function setPhysics(object){
	object.speed = Math.floor(Math.random() * object.range + object.min);
	object.style.top = 0 - Math.floor(Math.random() * 250 + 200) + "px";
	object.style.left = Math.floor(Math.random() * (_W - object.width)) + "px";
}

function makePlane(){
	var planeNumber;
	do{
		planeNumber = Math.floor(Math.random() * 9);
	} while(usedNumbers.indexOf(planeNumber) != -1);
	usedNumbers.push(planeNumber);
	planes.appendChild(document.createElement('img'));
	planes.lastChild.src = "img/plane" + planeNumber + ".png";
	planes.lastChild.style.visibility = "visible";
	planes.lastChild.style.position = "absolute";
	planes.lastChild.range = 8;
	planes.lastChild.min = 1;
	planes.lastChild.number = planeNumber;
	setPhysics(planes.lastChild);
}

function makeElement(array, src, range, min){
	array.appendChild(document.createElement('img'));
	array.lastChild.src = src;
	array.lastChild.style.visibility = "visible";
	array.lastChild.style.position = "absolute";
	array.lastChild.range = range;
	array.lastChild.min = min;
	setPhysics(array.lastChild);
}

function countDown(){
	timer.innerHTML--;
	if(timer.innerHTML <= 10){
		timer.style.color = "red";
		if(timer.innerHTML == 0){
			clearInterval(moveInterval);
			clearInterval(countDownInterval);
			gameOver = true;
		}
	}
}

function start(){
	gameOver = false;
	for(var i = 0; i < CLOUD_COUNT; i++) makeElement(clouds, "img/cloud.png", 3, 1);
	usedNumbers = [];
	for(var i = 0; i < PLANE_COUNT; i++) makePlane();
	for(var i = 0; i < DUCK_COUNT; i++) makeElement(ducks.array, "img/duclement.png", 3, 1);
	explosionInterval = -1;
	moveInterval = setInterval(move, 1000/60);
	countDownInterval = setInterval(countDown, 1000);
}

window.onload = function(ev){
	ducks = {};
	ducks.index = 0;
	planes = document.getElementById('planes');
	clouds = document.getElementById('clouds');
	explosions = document.getElementById('explosions');
	ducks.array = document.getElementById('ducks');
	scoreboard = document.getElementById('scoreboard');
	score = document.getElementById('score');
	planeHits = document.getElementById('planeHits');
	duckHits = document.getElementById('duckHits');
	misses = document.getElementById('misses');
	timer = document.getElementById('timer');
	start();
};

window.onresize = function(ev){
	_W = window.innerWidth;
};
