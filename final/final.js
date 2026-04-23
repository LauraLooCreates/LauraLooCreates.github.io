const pathSvg = document.getElementById('path');
const pathEl= pathSvg.querySelector('path');
const pathLength= pathEl.getTotalLength();
const dot = document.getElementById('dot');
const output = document.getElementById('demo');
let lock= false;

class Node{
    constructor(text, answer){
        this.text=text;
        this.answer=answer;
        this.next=null
    }
}

const q1 = new Node("Are you trying to adjust your volume?", "yes");
const q2 = new Node("Doesn't this seem stupid?", "yes");
const q3 = new Node("Is it difficult to adjust??", "yes");
const q4= new Node("Is it annoying?", "yes");
const q5 = new Node("Oh, aren't you gonna get an A on this?", "yes");
const q6 = new Node("Has it adjusted yet?", "yes");


let currentNode= q1;
let questionInterval=null;

q1.next = q2;
q2.next= q3;
q3.next= q4;
q4.next=q5;
q5.next=q6;
q6.next = q1;

let isDragging=false;
const minY=20;
const maxY=650;

dot.addEventListener('mousedown',(e)=>{
    isDragging=true;
    questionFlow();
    
})

const questionText = document.getElementById("question-text");
const questionBox = document.getElementById("question-box");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
let questionSeen =false;

function showQuestion() {
    if (!currentNode) return;
    if (questionSeen) return;

    questionSeen = true;
    questionText.textContent = currentNode.text;
    questionBox.style.display = 'block';
    lock=true;
}

function hideQuestion() {
    questionBox.style.display = 'none';
    questionSeen=false;
}

function checkAnswer(choice) {
    if (currentNode.answer === choice) {
        currentNode = currentNode.next;
        hideQuestion();

    } else {
        alert("Nice try! Start over!");

        currentNode = q1;
        lastTrigger = -1;
        output.textContent = 0;

        const start = pathEl.getPointAtLength(0);
        dot.setAttribute('cx', start.x);
        dot.setAttribute('cy', start.y);
    }
    questionSeen = false;
    lock=false;
}

yesBtn.addEventListener('click', () => checkAnswer('yes'));
noBtn.addEventListener('click', () => checkAnswer('no'));

let lastTrigger= -1;

document.addEventListener('mousemove', (e) => {
    if (!isDragging || lock) return;

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
        if(!currentNode)return;

        showQuestion();
    
    },1500);
}

document.addEventListener('mouseup', () => {
    isDragging = false;
    clearInterval(questionInterval);
    questionInterval=null;
});





questionBox.style.display = 'none';