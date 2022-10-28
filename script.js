let blackjackGame = {
    'you':{'scoreSpan':'#your_result', 'div':'#your_box', 'score':0 },
    'dealer':{'scoreSpan':'#dealer_result', 'div':'#dealer_box', 'score':0 },
    'tableCards': ['2','3','4','5','6','7','8','9','10','A','J','K','Q'],
    'cardsMap': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'K':10,'Q':10,'A':[1,11]},
    'wins':0,
    'loses':0,
    'draws':0,
    'isStand':false,
    'turnOver':false,    
}
const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const HITSOUND = new Audio ('sounds/swish.m4a');
const LOSTSOUND = new Audio ('sounds/aww.mp3');
const WINSOUND = new Audio ('sounds/cash.mp3');


document.querySelector('#hit_button').addEventListener('click',blackjackhit);
document.querySelector('#stand_button').addEventListener('click',dealerLogic);
document.querySelector('#deal_button').addEventListener('click',blackjackdeal);
document.querySelector('#stand_button').disabled = true;

function randomCard(){
let randomNum = Math.floor(Math.random()*13);
return blackjackGame['tableCards'][randomNum];
}

function blackjackhit(){
  document.querySelector('#stand_button').disabled = false;
  if (blackjackGame['isStand']=== false) {
    if(YOU['score']<21){
      let card = randomCard()
      showCard(card,YOU);
      updateScore(card, YOU);
      showScore(YOU);

    }
  }
}


function showCard(card, player){
  let cardImg = document.createElement('img');
  cardImg.src=`imgs/cards/${card}.png`;
  document.querySelector(player['div']).appendChild(cardImg);
  HITSOUND.play();
}

function blackjackdeal(){
  if(blackjackGame['turnOver']===true) {
        blackjackGame['isStand'] = false;
    let yourImgs = document.querySelector('#your_box').querySelectorAll('img');
    let dealerImgs = document.querySelector('#dealer_box').querySelectorAll('img');
    console.log(yourImgs);
    console.log(dealerImgs);
    for(i=0; i<yourImgs.length; i++){
      yourImgs[i].remove();  
    }
    for(i=0; i<dealerImgs.length; i++){
      dealerImgs[i].remove();  
    }
    returnToDefault();
  }
}

function updateScore(card, player){
  if(card === 'A'){
      if(player['score'] + blackjackGame['cardsMap'][card][1] <= 21 ){
        player['score'] += blackjackGame['cardsMap'][card][1];
      }else{
        player['score'] += blackjackGame['cardsMap'][card][0];
      }
    }else{
    player['score'] += blackjackGame['cardsMap'][card];
  }
}

function showScore(player){
  if(player['score'] > 21 ){
    document.querySelector(player['scoreSpan']).textContent = 'BUST!';
    document.querySelector(player['scoreSpan']).style.color ='red';
  }else{
  document.querySelector(player['scoreSpan']).textContent = player['score'];
}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic(){
  blackjackGame['isStand'] = true;
  document.querySelector('#stand_button').disabled = true;
  while (DEALER['score']<16 && blackjackGame['isStand'] === true){
    let card = randomCard();
  showCard(card, DEALER);
  updateScore(card, DEALER);
  showScore(DEALER);
  await sleep(1000);
  
  }
   
    blackjackGame['turnOver'] = true;
    finalResult(theWinner());  


}

function theWinner(){
  let winner;
  if(YOU['score'] <= 21){
    if ((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)) {
      winner = YOU;
      blackjackGame['wins']++; 
    }else if(DEALER['score'] > YOU['score']){
      winner = DEALER;
      blackjackGame['loses']++; 
    }else if(DEALER['score'] === YOU['score']){
      blackjackGame['draws']++;
    }
  }else if((YOU['score'] > 21) && DEALER['score']<=21){
    winner = DEALER;
    blackjackGame['loses']++;
  }else if((YOU['score'] > 21)&&(DEALER['score'] > 21)){
    blackjackGame['draws']++;
  }
  return winner;
}

function finalResult(winner){
  if(blackjackGame['turnOver']===true){
    if (winner === YOU) {
    message = 'YOU WON !';
    messageColor = 'green';
    WINSOUND.play();
    }
    else if (winner === DEALER) {
    message = 'YOU LOST !';
    messageColor = 'red';
    LOSTSOUND.play();
    }
    else{
    message = 'YOU DREW !';
    messageColor = 'gold';
    }
    document.querySelector('#result').textContent = message;
    document.querySelector('#result').style.color = messageColor;

    document.querySelector('#wins').textContent = blackjackGame['wins'];
    document.querySelector('#loses').textContent = blackjackGame['loses'];
    document.querySelector('#draws').textContent = blackjackGame['draws'];
  }
}

function returnToDefault() {
  YOU['score'] = 0;
  DEALER['score'] = 0;
  document.querySelector(YOU['scoreSpan']).textContent = 0;
  document.querySelector(YOU['scoreSpan']).style.color ='gold';
  document.querySelector(DEALER['scoreSpan']).textContent = 0;
  document.querySelector(DEALER['scoreSpan']).style.color = 'gold';
  document.querySelector('#result').textContent = "Let's Play";
  document.querySelector('#result').style.color = 'azure';
  blackjackGame['isStand']=false;
  blackjackGame['turnOver']=false;
}