const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");
const numParticles = 90;
const particles = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var animate = true;
const backgroundColor = "#213e3b";
const particleColor = "#a6f6f1";
const lineMaxDist = 150;
let frame = 0;
const forceDist = 100;

//FUNCTIONS /////////////////////////////////////////////////////////
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
  return Math.sqrt(a*a + b*b);
}

function animation() {
  frame ++;
  if (animate == true) {
    requestAnimationFrame(animation);
  }
  //clean // bg
  c.fillStyle = backgroundColor;
  c.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    const dist = distance(particle.position, player.position);
    if (dist < lineMaxDist*3) {
      c.beginPath();
      c.moveTo(particle.position.x, particle.position.y);
      c.lineTo(player.position.x, player.position.y);
      c.strokeStyle = `rgba(255,255,255, ${ map_range(dist, 0, lineMaxDist*3, .2, 0) })`;
      c.closePath();
      c.stroke();

    }


    particles.forEach((otherParticle) => {
      var dist = distance(particle.position, otherParticle.position);
      if (dist != 0 && dist < lineMaxDist) {
        c.beginPath();
        c.moveTo(particle.position.x, particle.position.y);
        c.lineTo(otherParticle.position.x, otherParticle.position.y);
        c.strokeStyle = `rgba(255,255,255, ${ map_range(dist, 0, lineMaxDist, .2, 0) })`;
        c.closePath();
        c.stroke();

      }
    });

  });
  player.update();

}

//CLASSES ////////////////////////////////////////////////////////////////


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
    if (this.position.x < 0 + this.radius || this.position.x > canvas.width - this.radius) {
      this.velocity.x *= -1;
    }
    if (this.position.y < 0 + this.radius || this.position.y > canvas.height - this.radius) {
      this.velocity.y *= -1;
    }

  }

  force(){
    const dist = distance(player.position, this.position);
    if(dist < forceDist){
      const direction = map_range(dist, 0, forceDist, -1.5, -.5);
      const angle = Math.atan2(player.position.y- this.position.y, player.position.x-this.position.x);
      this.velocity.x = Math.cos(angle)*direction;
      this.velocity.y = Math.sin(angle)*direction;
    }
  }


  update() {
    this.draw();
    // this.borders();
    this.walls();
    this.force();
    this.position = addObj(this.position, this.velocity);
  }
}

class Player {
  constructor(radius, color) {
    this.position = {
      x: canvas.width / 2,
      y: canvas.height / 2
    };
    this.radius = radius;
    this.color = color;
  };
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  };

  update(){
    this.draw();
    this.radius = (Math.sin(frame*.04)+1)*2 ;
    this.radius += 3;
  };

}



//ACTUAL GAME //////////////////////////////////////////////////////////
var player = new Player(5, "white");
spawn();
animation();

document.querySelector("body").addEventListener("mousemove", function(event) {
  player.position.x = event.clientX;
  player.position.y = event.clientY;
});
//
document.querySelector("body").addEventListener("touchmove", function(event) {

  player.position.x = Math.round(event.changedTouches[0].clientX);
  player.position.y =Math.round(event.changedTouches[0].clientY);
});

document.querySelector("body").addEventListener("touchstart", function(event) {

  player.position.x = Math.round(event.changedTouches[0].clientX);
  player.position.y =Math.round(event.changedTouches[0].clientY);
});

window.addEventListener("resize", function(event){
  const oldW = canvas.width;
  const oldH = canvas.height;
  particles.forEach((particle) => {
    particle.position.x *= window.innerWidth / oldW;
    particle.position.y *= window.innerHeight/ oldH;
  });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});




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
