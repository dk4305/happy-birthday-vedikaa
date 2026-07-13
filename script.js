// ==========================================
// CANVAS PARTICLE BACKGROUND
// ==========================================

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let lastWidth = window.innerWidth;

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Mobile browsers fire "resize" just from the address bar
    // showing/hiding while scrolling. Only reset particle
    // positions on an actual width change (real resize / rotation),
    // otherwise the stars visibly "jump" every time you scroll.
    if (window.innerWidth !== lastWidth) {

        particles.forEach(p => {

            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;

        });

        lastWidth = window.innerWidth;

    }

}

window.addEventListener("load", resizeCanvas);

window.addEventListener("resize", resizeCanvas);

const particles = [];

class Particle {

    constructor() {

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 2 + 1;

        this.speedX = (Math.random() - 0.5) * 0.05;
        this.speedY = (Math.random() - 0.5) * 0.05;

        this.opacity = Math.random();

        this.angle = Math.random() * Math.PI * 2;

        // 0 = dot
        // 1 = 4 point star
        // 2 = 8 point star

        this.type = Math.floor(Math.random() * 3);

    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;

        if (this.y < -20) this.y = canvas.height + 20;
        if (this.y > canvas.height + 20) this.y = -20;

        this.angle += 0.01;

        this.opacity = 0.35 + Math.abs(Math.sin(Date.now() * 0.0015 + this.angle)) * 0.65;

    }

    draw() {

        ctx.save();

        ctx.translate(this.x, this.y);

        ctx.rotate(this.angle);

        ctx.globalAlpha = this.opacity;

        ctx.strokeStyle = "#F4C430";
        ctx.strokeStyle = "#F4C430";
        ctx.fillStyle = "#FFE27A";
        ctx.shadowColor = "#FFD54A";
        ctx.shadowBlur = 20;
        if (this.type === 0) {

            ctx.beginPath();
            ctx.arc(0,0,this.size,0,Math.PI*2);
            ctx.fill();

        }

        else if(this.type===1){

            drawFourStar(this.size);

        }

        else{

            drawEightStar(this.size);

        }

        ctx.restore();

    }

}

function drawFourStar(size){

    ctx.lineWidth=1.5;

    ctx.beginPath();
    ctx.moveTo(0,-size*6);
    ctx.lineTo(0,size*6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-size*6,0);
    ctx.lineTo(size*6,0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0,0,size,0,Math.PI*2);
    ctx.fill();

}

function drawEightStar(size){

    drawFourStar(size);

    ctx.rotate(Math.PI/4);

    drawFourStar(size*0.8);

}

for (let i = 0; i < 250; i++){

    particles.push(new Particle());

}

function animateParticles() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {

        p.update();
        p.draw();

    });

    meteor.update();

    requestAnimationFrame(animateParticles);

}
// ==========================================
// Shooting Star
// ==========================================

class ShootingStar {

    constructor() {
        this.reset();
    }

    reset() {
        this.active = false;
    }

    start() {

        this.active = true;

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * (canvas.height * 0.4);

        this.length = 120 + Math.random() * 120;
        this.speed = 8 + Math.random() * 6;

    }

    update() {

        if (!this.active) return;

        this.x -= this.speed;
        this.y += this.speed;

        const gradient = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x + this.length,
            this.y - this.length
        );

        gradient.addColorStop(0, "rgba(255,215,0,1)");
        gradient.addColorStop(1, "rgba(255,215,0,0)");

        ctx.beginPath();

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;

        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y - this.length);

        ctx.stroke();

        if (this.y > canvas.height + 100) {
            this.active = false;
        }

    }

}

const meteor = new ShootingStar();

setInterval(() => {
    meteor.start();
}, 3000);

animateParticles();


// ==========================================
// AOS
// ==========================================

AOS.init({
    duration: 1000,
    once: true
});


// ==========================================
// MAKE A WISH
// ==========================================

const wishBtn = document.getElementById("wishBtn");
const popup = document.getElementById("popup");

wishBtn.addEventListener("click", () => {

    confetti({
        particleCount: 180,
        spread: 120,
        origin: {
            y: 0.6
        }
    });

    setTimeout(() => {

        confetti({
            particleCount: 100,
            spread: 90,
            origin: {
                x: 0.2,
                y: 0.7
            }
        });

        confetti({
            particleCount: 100,
            spread: 90,
            origin: {
                x: 0.8,
                y: 0.7
            }
        });

    }, 250);

    popup.style.display = "flex";

});


// ==========================================
// CLOSE POPUP
// ==========================================

function closePopup() {

    popup.style.display = "none";

}

window.addEventListener("click", (e) => {

    if (e.target === popup) {

        popup.style.display = "none";

    }

});


// ==========================================
// IMAGE PREVIEW
// ==========================================

const images = document.querySelectorAll(".photos img");

images.forEach(img => {

    img.addEventListener("click", () => {

        const overlay = document.createElement("div");

        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(0,0,0,.9)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.cursor = "zoom-out";
        overlay.style.zIndex = "9999";

        const photo = document.createElement("img");

        photo.src = img.src;
        photo.style.maxWidth = "90%";
        photo.style.maxHeight = "90%";
        photo.style.borderRadius = "20px";
        photo.style.boxShadow = "0 25px 60px rgba(0,0,0,.4)";

        overlay.appendChild(photo);

        document.body.appendChild(overlay);

        overlay.onclick = () => overlay.remove();

    });

});


// ==========================================
// HERO FADE
// ==========================================

window.addEventListener("scroll", () => {

    const hero = document.querySelector(".hero");

    hero.style.opacity = Math.max(
        1 - window.scrollY / 500,
        0.25
    );

});

// ===================================
// INTRO TYPING
// ===================================

const title = document.getElementById("typingTitle");
const nameText = document.getElementById("typingName");
const message = document.getElementById("typingMessage");
const tap = document.getElementById("tapText");

const intro = document.getElementById("intro");
const main = document.getElementById("mainContent");

const line1 = "Happy Birthday";
const line2 = "Vedikaa ✨";
const line3 = "A little surprise....";

let i = 0;
let j = 0;
let k = 0;

function typeTitle(){

    if(i<line1.length){

        title.innerHTML+=line1.charAt(i);

        i++;

        setTimeout(typeTitle,90);

    }

    else{

        setTimeout(typeName,300);

    }

}

function typeName(){

    if(j<line2.length){

        nameText.innerHTML+=line2.charAt(j);

        j++;

        setTimeout(typeName,120);

    }

    else{

        setTimeout(typeMessage,300);

    }

}

function typeMessage(){

    if(k<line3.length){

        message.innerHTML+=line3.charAt(k);

        k++;

        setTimeout(typeMessage,45);

    }

    else{

        tap.style.opacity="1";

    }

}

typeTitle();

// ==========================================
// Magical Intro Exit
// ==========================================

intro.addEventListener("click", () => {

    const music = document.getElementById("bgMusic");

    music.volume = 0;

music.play();

let volume = 0;

const fade = setInterval(() => {

    if (volume >= 0.35) {

        clearInterval(fade);

    } else {

        volume += 0.02;

        music.volume = volume;

    }

}, 120);

    for(let i=0;i<140;i++){

        createSparkle();

    }

    intro.style.transition="1.5s";

    intro.style.opacity="0";

    intro.style.transform="scale(1.08)";

    setTimeout(()=>{

        intro.style.display="none";

        main.style.opacity="1";

    },1300);

});
// ==========================================
// Intro Sparkles
// ==========================================

function createSparkle(){

    const s=document.createElement("div");

    s.className="introSparkle";

    s.style.left=Math.random()*window.innerWidth+"px";

    s.style.top=Math.random()*window.innerHeight+"px";

    s.style.setProperty("--x",(Math.random()-0.5)*700+"px");

    s.style.setProperty("--y",(Math.random()-0.5)*700+"px");

    document.body.appendChild(s);

    setTimeout(()=>{

        s.remove();

    },1800);

}