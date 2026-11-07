const CATS = {
  strength: "Strength",
  moisture: "Moisture",
  scalp: "Scalp health",
  shedding: "Shedding"
};
// Each option score: 0 (poor) to 3 (great)
const QUESTIONS = [
  {cat:"strength", q:"When you gently stretch a wet strand, what happens?", o:["It snaps right away","It stretches a little, then breaks","It stretches and breaks late","It stretches well and springs back"]},
  {cat:"strength", q:"How much split ends or breakage do you notice?", o:["A lot, every day","Quite a few","A few","Almost none"]},
  {cat:"moisture", q:"How does your hair feel once it is dry?", o:["Rough and straw-like","Dry at the ends","Mostly soft","Soft and smooth throughout"]},
  {cat:"moisture", q:"How often do you use heat tools or chemical treatments?", o:["Almost daily","Weekly","Monthly","Rarely or never"]},
  {cat:"scalp", q:"How is your scalp between washes?", o:["Itchy, flaky or sore","Often oily or dry","Occasionally irritated","Comfortable and clear"]},
  {cat:"scalp", q:"How soon does your hair look greasy after washing?", o:["Same day","Next day","Day 2 to 3","Day 3 or later, or as expected for my type"]},
  {cat:"shedding", q:"How many hairs do you find on your brush or in the drain?", o:["Clumps","More than usual","About usual","Very few"]},
  {cat:"shedding", q:"Has your parting or hairline changed in the last year?", o:["Clearly thinner","Slightly thinner","Not sure","No change"]}
];
const TIPS = {
  strength:"Trim split ends every 8 to 12 weeks, detangle from the ends upward, and add a bond-repair or protein treatment every 1 to 2 weeks.",
  moisture:"Use a leave-in conditioner, wash with lukewarm water, and cut heat styling to once or twice a week with a heat protectant.",
  scalp:"Use a gentle shampoo matched to your scalp type, rinse thoroughly, and avoid scratching. If flaking or itching persists, try an anti-dandruff shampoo.",
  shedding:"Some daily shedding is normal. Look at iron, vitamin D and stress levels, and see a doctor if thinning continues for more than a few months."
};
let i = 0, scores = {};
const $ = id => document.getElementById(id);

function show(){
  const item = QUESTIONS[i];
  $("count").textContent = "Question " + (i+1) + " of " + QUESTIONS.length;
  $("bar").style.width = (i/QUESTIONS.length*100) + "%";
  $("question").textContent = item.q;
  const box = $("options"); box.innerHTML = "";
  item.o.forEach((text, score) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "opt"; b.textContent = text;
    b.onclick = () => pick(item.cat, score);
    box.appendChild(b);
  });
}
function pick(cat, score){
  scores[cat] = (scores[cat] || 0) + score;
  i++;
  i < QUESTIONS.length ? show() : finish();
}
function colour(p){ return p >= 70 ? "var(--good)" : p >= 45 ? "var(--mid)" : "var(--low)"; }
function finish(){
  $("quiz").hidden = true; $("sub").hidden = true; $("result").hidden = false;
  let sum = 0, max = 0, weak = [];
  const cats = $("cats"); cats.innerHTML = "";
  for (const key in CATS){
    const m = QUESTIONS.filter(q => q.cat === key).length * 3;
    const p = Math.round(scores[key] / m * 100);
    sum += scores[key]; max += m;
    if (p < 70) weak.push([p, key]);
    cats.insertAdjacentHTML("beforeend",
      '<div class="cat"><div class="row"><span>'+CATS[key]+'</span><span>'+p+'%</span></div>'+
      '<div class="track"><div class="fill" style="width:'+p+'%;background:'+colour(p)+'"></div></div></div>');
  }
  const total = Math.round(sum / max * 100);
  $("total").textContent = total;
  $("verdict").textContent = total >= 75 ? "Your hair is performing well. Keep your routine steady."
    : total >= 50 ? "Your hair is doing okay, with a few areas to improve."
    : "Your hair needs some care. Start with the weakest areas below.";
  weak.sort((a,b) => a[0]-b[0]);
  $("tips").innerHTML = (weak.length ? weak : [[0,"strength"]]).map(w =>
    "<li><strong>" + CATS[w[1]] + ":</strong> " + (weak.length ? TIPS[w[1]] : "Keep up what you are doing and re-check in a month.") + "</li>").join("");
}
$("restart").onclick = () => {
  i = 0; scores = {};
  $("result").hidden = true; $("quiz").hidden = false; $("sub").hidden = false; show();
};
show();
