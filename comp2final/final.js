const STATES = {
  IDLE: "idle",       
  DRAGGING: "dragging",
  QUESTION: "question",
  RESULT: "result"
};

let state = STATES.IDLE;

const pathSvg = document.getElementById('path');
const pathEl= pathSvg.querySelector('path');
const pathLength= pathEl.getTotalLength();
const dot = document.getElementById('dot');
const output = document.getElementById('demo');
let isMouseDown= false;


class Node{
    constructor(text, answer){
        this.text=text;
        this.answer=answer;
        this.next=null
    }
}

const q1 = new Node("Are you trying to adjust your volume?", "yes");
const q2 = new Node("Doesn't this design seem stupid?", "yes");
const q3 = new Node("Is it difficult to adjust??", "yes");
const q4= new Node("Is adjusting it annoying?", "yes");
const q5 = new Node("Are you gonna get an A on this?", "yes");
const q6 = new Node("Shouldn't the volume decrease if you drag down??", "yes");
const q7 = new Node("Does that seem counterintuitive...", "yes");


let currentNode= q1;
let questionInterval=null;

q1.next = q2;
q2.next= q3;
q3.next= q4;
q4.next=q5;
q5.next=q6;
q6.next=q7;
q7.next = q1;

const minY=20;
const maxY=500;

dot.addEventListener('mousedown',(e)=>{
    if(state!==STATES.IDLE && state!==STATES.DRAGGING)return;
    isMouseDown=true;
    state=STATES.DRAGGING;
    questionFlow(); 
    
})

const questionText = document.getElementById("question-text");
const questionBox = document.getElementById("question-box");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const submitBtn = document.getElementById("submit");

let questionSeen =false;
let isShowingResult= false;

output.textContent="0";

function showQuestion() {
    if (!currentNode) return;
    if (questionSeen) return;

    questionSeen=true;

    state=STATES.QUESTION;

    clearInterval(questionInterval);
    questionInterval = null;

    isMouseDown=false;

    questionText.textContent = currentNode.text;

    yesBtn.style.display = "inline-block";
    noBtn.style.display = "inline-block";

    questionBox.style.display = 'block';
}

function showVolume(){
    state= STATES.RESULT;
    
    const value = output.textContent;

    questionText.textContent="Your volume is: "+ value +"%";

    yesBtn.style.display="none";
    noBtn.style.display="none";

    questionBox.style.display="block";

    isShowingResult=true;

    clearInterval(questionInterval);
    questionInterval = null;

}

function hideQuestion() {
    questionBox.style.display = 'none';
    questionSeen=false;
}

function checkAnswer(choice) {
    if (currentNode.answer === choice) {
        currentNode = currentNode.next;
        hideQuestion();
        state = STATES.DRAGGING;

        questionFlow();

    } else {
        alert("Nice try! Start over!");

        resetAll();
        
    }

    questionSeen = false;
}

function resetAll(){
    clearInterval(questionInterval);
    questionInterval = null;
    
    currentNode = q1;
    // lastTrigger = -1;
    output.textContent = 0;

    const start = pathEl.getPointAtLength(0);
    dot.setAttribute('cx', start.x);
    dot.setAttribute('cy', start.y);

    hideQuestion();

    state=STATES.IDLE;
}

yesBtn.addEventListener('click', () => checkAnswer('yes'));
noBtn.addEventListener('click', () => checkAnswer('no'));
submitBtn.addEventListener('click',(e)=>{
    e.stopPropagation();
    showVolume();
});


let lastTrigger= -1;

document.addEventListener('mousemove', (e) => {
    if (state !==STATES.DRAGGING || !isMouseDown) return;

    const rect = pathSvg.getBoundingClientRect();
    let y = e.clientY - rect.top;
    y = Math.max(minY, Math.min(maxY, y));

    let percent = (y - minY) / (maxY - minY);

    const distance = percent * pathLength;
    const point = pathEl.getPointAtLength(distance);

    dot.setAttribute('cx', point.x);
    dot.setAttribute('cy', point.y);

    let value = Math.round(percent * 100);
    output.textContent = value;

});

function questionFlow(){
    if(questionInterval) return;

    questionInterval=setInterval(()=>{
        if(!currentNode || state !== STATES.DRAGGING || !isMouseDown)return;

        showQuestion();
    
    },2000);
}
document.addEventListener('click',(e)=>{
    if(state!==STATES.RESULT)return;

    if (!questionBox.contains(e.target)){
        questionBox.style.display='none';
        state=STATES.IDLE;
    };

})

document.addEventListener('mouseup', () => {
    isMouseDown=false;

    clearInterval(questionInterval);
    questionInterval = null;

    if(state===STATES.DRAGGING){
        state=STATES.IDLE;
    }
});

questionBox.style.display = 'none';

let boids = [];
const numBoids = 26;
const svgWidth = 400;
const svgHeight = 570;

function randomColor() {
    const colors = ['#0476D9', '#056CF2', '#F29F05', '#F2E8C9', '#F21B1B'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createBoid() {
    const r = Math.random() * 15 + 5; 
    const x = Math.random() * (svgWidth - 2*r) + r;
    const y = Math.random() * (svgHeight - 2*r) + r;
    const vx = (Math.random() - 0.5) * 2;
    const vy = (Math.random() - 0.5) * 2;
    const color = randomColor();
    const border = randomColor();
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', color);
    circle.setAttribute('stroke', border);
    circle.setAttribute('stroke-width', '2');
    circle.style.cursor = 'pointer';
    
    circle.addEventListener('click', () => {
        pathSvg.removeChild(circle);
        boids = boids.filter(b => b.circle !== circle);
    });
    
    pathSvg.appendChild(circle);
    
    return { circle, x, y, vx, vy, r ,border};
}

function refillBoids() {
    boids.forEach(b => pathSvg.removeChild(b.circle));
    boids = [];
    for (let i = 0; i < numBoids; i++) {
        boids.push(createBoid());
    }
}

function animateBoids() {
    boids.forEach(boid => {
        boid.x += boid.vx;
        boid.y += boid.vy;
        
        if (boid.x - boid.r <= 0 || boid.x + boid.r >= svgWidth) {
            boid.vx *= -0.5;
            boid.x = Math.max(boid.r, Math.min(svgWidth - boid.r, boid.x));
        }
        if (boid.y - boid.r <= 0 || boid.y + boid.r >= svgHeight) {
            boid.vy *= -0.5;
            boid.y = Math.max(boid.r, Math.min(svgHeight - boid.r, boid.y));
        }
        
        boid.circle.setAttribute('cx', boid.x);
        boid.circle.setAttribute('cy', boid.y);
    });
    
    requestAnimationFrame(animateBoids);
}

animateBoids();

refillBoids();