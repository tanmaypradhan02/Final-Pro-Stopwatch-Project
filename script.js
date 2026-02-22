/* PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for(let i=0;i<120;i++){
    particles.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        r:Math.random()*2+1,
        dx:Math.random()-0.5,
        dy:Math.random()-0.5
    });
}

function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
        p.x+=p.dx;
        p.y+=p.dy;
        if(p.x<0||p.x>canvas.width)p.dx*=-1;
        if(p.y<0||p.y>canvas.height)p.dy*=-1;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="white";
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* STOPWATCH */
let timer, ms=0, sec=0, min=0, running=false;

function updateDisplay(){
    document.getElementById("display").innerHTML =
        String(min).padStart(2,"0")+":"+
        String(sec).padStart(2,"0")+":"+
        String(ms).padStart(2,"0");
    updateCircle();
}

function start(){
    if(!running){
        running=true;
        timer=setInterval(()=>{
            ms++;
            if(ms==100){ms=0;sec++;}
            if(sec==60){sec=0;min++;}
            updateDisplay();
        },10);
    }
}

function pause(){
    running=false;
    clearInterval(timer);
}

function reset(){
    running=false;
    clearInterval(timer);
    ms=sec=min=0;
    updateDisplay();
    document.getElementById("laps").innerHTML="";
}

/* LAP + GRAPH */
let lapData=[];
const ctxChart=document.getElementById("lapChart");
let lapChart=new Chart(ctxChart,{
    type:"line",
    data:{
        labels:[],
        datasets:[{
            label:"Lap Time (sec)",
            data:[],
            borderColor:"cyan",
            tension:0.4
        }]
    }
});

function lap(){
    if(running){
        let time=document.getElementById("display").innerHTML;
        let li=document.createElement("li");
        li.innerText="Lap: "+time;
        document.getElementById("laps").appendChild(li);

        let secTime=min*60+sec;
        lapData.push(secTime);
        lapChart.data.labels.push("Lap "+lapData.length);
        lapChart.data.datasets[0].data.push(secTime);
        lapChart.update();
    }
}

/* DIGITAL CLOCK */
function digitalClock(){
    document.getElementById("clock").innerHTML =
        "Current Time: "+new Date().toLocaleTimeString();
}
setInterval(digitalClock,1000);

/* DARK LIGHT MODE */
function toggleTheme(){
    document.body.classList.toggle("light");
}

/* CIRCULAR TIMER */
let circle=document.getElementById("circle");
let circumference=2*Math.PI*80;
circle.style.strokeDasharray=circumference;
circle.style.strokeDashoffset=circumference;

function updateCircle(){
    let total=min*60+sec;
    let progress=total%60;
    let offset=circumference-(progress/60)*circumference;
    circle.style.strokeDashoffset=offset;
}

/* VOICE CONTROL */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if(SpeechRecognition){
    const recognition = new SpeechRecognition();
    recognition.continuous=true;
    recognition.lang="en-US";
    recognition.onresult=function(e){
        let cmd=e.results[e.results.length-1][0].transcript.toLowerCase();
        if(cmd.includes("start")) start();
        if(cmd.includes("stop")||cmd.includes("pause")) pause();
        if(cmd.includes("reset")) reset();
    };
    recognition.start();
}