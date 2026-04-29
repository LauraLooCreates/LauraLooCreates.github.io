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
    if(state===STATES.RESULT)return;
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

    (questionInterval);
    questionInterval = null;

    if(state===STATES.DRAGGING){
        state=STATES.IDLE;
    }
});

questionBox.style.display = 'none';