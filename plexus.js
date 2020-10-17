const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");
const numParticles = 30;
const particles = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var animate = true;
const backgroundColor = "black";
const particleColor = "white";
const lineMaxDist = 200;

class Particle {
  constructor(position, radius, velocity, color) {
    this.position = position;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  borders() {
    if (this.position.x < 0 - this.radius) {
      this.position.x += canvas.width + this.radius * 2;
    }
    if (this.position.x > canvas.width + this.radius) {
      this.position.x -= canvas.width + this.radius * 2;
    }
    if (this.position.y < 0 - this.radius) {
      this.position.y += canvas.height + this.radius * 2;
    }
    if (this.position.y > canvas.height + this.radius) {
      this.position.y -= canvas.height + this.radius * 2;
    }
  }

  walls() {
    if(this.position.x < 0 + this.radius || this.position.x > canvas.width - this.radius){
      this.velocity.x *= -1;
    }
    if(this.position.y < 0 + this.radius || this.position.y > canvas.height - this.radius){
      this.velocity.y *= -1;
    }

  }

  update() {
    this.draw();
    // this.borders();
    this.walls();
    this.position = addObj(this.position, this.velocity);
  }
}

class Particle {
  constructor(position, radius, velocity, color) {
    this.position = position;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.position = addObj(this.position, this.velocity);
  }
}

// FUNCTIONS-----------------------------------------------------------
function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


function addObj(obj1, obj2) {
  Object.keys(obj1).forEach((key) => {
    obj1[key] = obj1[key] + obj2[key];
  });
  return obj1;
}


function spawn() {
  for (i = 0; i < numParticles; i++) {
    particles.push(new Particle({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
      },
      2, {
        x: Math.random() - .5,
        y: Math.random() - .5
      },
      particleColor
    ));
  }
}

function distance(position1, position2) {
  const a = position1.x - position2.x;
  const b = position1.y - position2.y;
  return Math.hypot(a, b);
}

function animation() {
  if (animate == true) {
    requestAnimationFrame(animation);
  }
  //clean // bg
  c.fillStyle = backgroundColor;
  c.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particles.forEach((otherParticle) => {
      const dist = distance(particle.position, otherParticle.position);
      if (dist != 0 && dist < lineMaxDist) {
        c.moveTo(particle.position.x, particle.position.y);
        c.lineTo(otherParticle.position.x, otherParticle.position.y);
        c.strokeStyle = `rgba(255,255,255, ${ map_range(dist, 0, lineMaxDist, .2, 0) })`;
        c.stroke();
      }
    });
  });

}


//ACTUAL GAME //////////////////////////////////////////////////////////
console.log(particles);
spawn();
animation();

//LINE---------------------------------------------------------------------
// ctx.moveTo(0, 0);
// ctx.lineTo(200, 100);
// ctx.stroke();

//RECTANGLE---------------------------------------------------------------------
// c.fillStyle = "black";
// c.fillRect(0, 0, canvas.width, canvas.height);

//CIRCLE---------------------------------------------------------------------
// c.beginPath();
// c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
// c.fillStyle = this.color;
// c.fill();


//TEXT---------------------------------------------------------------------
// ctx.font = "30px Arial";
// ctx.fillText("Hello World", 10, 50);
// or
// ctx.strokeText("Hello World", 10, 50);

//GRADIENT---------------------------------------------------------------------
// var grd = ctx.createLinearGradient(0, 0, 200, 0);
// grd.addColorStop(0, "red");
// grd.addColorStop(1, "white");
//
// // Fill with gradient
// ctx.fillStyle = grd;
// ctx.fillRect(10, 10, 150, 80);

//CIRCULAR GRADIENT---------------------------------------------------------------------
// var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
// grd.addColorStop(0, "red");
// grd.addColorStop(1, "white");
//
// // Fill with gradient
// ctx.fillStyle = grd;
// ctx.fillRect(10, 10, 150, 80);


//IMAGE---------------------------------------------------------------------
// var img = document.getElementById("scream");
// ctx.drawImage(img, 10, 10);

//MULTI DRAW?---------------------------------------------------------------------
// c.save();
// c.globalAlpha = this.alpha;
// c.beginPath();
// c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
// c.fillStyle = this.color;
// c.fill();
// c.restore();
