

const Devil = 'https://media.giphy.com/media/l3V0BFYUP1OUsYoMw/giphy.gif';

//sample list of characters;
//const Images= ["emoji_1.jpg", "emoji_2.jpg", "emoji_3.jpg", "emoji_4.jpg", "devil_2.jpg","emoji_5.jpg" ];
const charactersList = ["dogs", "superhero", "cats", "tom and jerry", "flogs", "clown"];


//Giphy api
const url = "https://api.giphy.com/v1/gifs/search?api_key=5f2qiYkKasRM65bApSg9R42vbXi57BSJ&q=";



//list of background images
const backgroundImage = [{name:"Devil_1", url:"https://media.giphy.com/media/OqWm9N0jJoqCQ/giphy.gif"}, 
                          {name: "Devil_2", url : "https://media.giphy.com/media/ftcujiuHpxAME/giphy.gif"}, 
                          {name: "Devil_3", url : "https://media.giphy.com/media/4az7CzgqIsvCM/giphy-downsized.gif"}, 
                          {name: "Devil_4", url : "https://media.giphy.com/media/N7vOlvO34yVCo/giphy.gif "},
                          {name: "Devil_5", url : "https://media.giphy.com/media/2Dp76judYfq3S/giphy.gif"},
                          {name: "Devil_6", url : "https://media.giphy.com/media/AGC0GkBRX8Y48/giphy.gif"},
                          {name: "Devil_6", url : "https://media.giphy.com/media/JvkKjnIlKQE9i/giphy.gif"}
                          
                        ];
const WinMessage = ["Congratulation you passed level 1", ""];
const LostMessage = [""]

let Characters = [];
let CharactersEvilIndex = [];
let gameScore = 0;
let gameLevel = 1;
let gameCharacter = "dog";

document.getElementById("bodyId").onload = function(){
    
    //setup background image option
    let optionImg = backgroundImage.map(backImg => {
        return `<option value=${backImg.url}>${backImg.name}</option>`;
    });
    document.getElementById("BackgroundImg").innerHTML= optionImg.join(" ");

    let optionChar = charactersList.map(char => {
        return `<option value=${char}>${char}</option>`;
    });

    document.getElementById("CharacterOption").innerHTML = optionChar.join(" ");

}


function getGiphy(level, character){
    console.log('character test: ', character);
    
    const promiseImg = [search(level*3 + 5, character), search(level*2, 'devil')]
    Promise.all(promiseImg)
    .then(data => {
        const CharactersImg = data[0].data.map(img => img.images.fixed_height_still.url);
        let CharactersEvil = data[1].data.map(img => img.images.fixed_height_still.url);
        //CharactersEvil = CharactersEvil.splice(5);
        Characters = shuffle(CharactersImg);
        CharactersEvilIndex = [];
        //randomly pick position of devil card;
        let charLen = Characters.length + CharactersEvil.length;
    
        while(CharactersEvilIndex.length < CharactersEvil.length){
            let indexEvil = Math.floor(Math.random()*(charLen));
             if(!CharactersEvilIndex.includes(indexEvil)){
                console.log("indexEvil= ", indexEvil);
                 CharactersEvilIndex.push(indexEvil);
             }
        }

        
        CharactersEvilIndex.sort(function(a, b){return a-b});
        for(let i = 0; i < charLen; i++){
            if(CharactersEvilIndex.includes(i)){
                Characters.splice(i, 0, "./images/devil_3.jpg");
            }
            
        }
       
        displayImages(Characters, CharactersEvilIndex);
        let timer = 5;
        let timeInterval = setInterval(function(){
            document.getElementById('Timer').innerText = timer; 
            if(timer === 0){
                clearInterval(timeInterval);
                flipImage(Characters);
                for(let i=0; i<Characters.length; i++){
                    if(CharactersEvilIndex.includes(i)){
                        document.getElementById("card_"+i).addEventListener("click", gameOver);
                    }else{
                        document.getElementById("card_"+i).addEventListener("click", gameplay);
                    }
                    
                }
            }
            timer -=1;
        }, 1000);
        
    })

    

}


function gameStarter(){
    document.getElementById("StartGameBtn").onclick = function(){
        // let current_char = getElementById()
        getGiphy(gameLevel, gameCharacter);
    }
}

gameStarter();

function search(num, query){
    return fetch(url+query+"&limit="+num)
    .then(response => response.json());
}



function displayImages(data, devilIndex){
    
    let listImg = data.map((img, i) => {
        //console.log(img);
        //return `<div class='cardImg'><img src="./images/${img}" class="imgSize"/></div>`
        if(devilIndex.includes(i)){
            return `<div class='cardImg evil animated  fadeInUpBig fast' id="cardBox_${i}"  ><img src="${img}" id="card_${i}" class="imgSize" data-index ="${i}"}/></div>`;
        }else{
            return `<div class='cardImg animated rollIn  fast' id="cardBox_${i}"><img src="${img}" id="card_${i}" class="imgSize" data-index ="${i}" }/></div>`;
        }
        
    });

    document.getElementById("main").innerHTML = listImg.join(" ");

}

function shuffle(data){
    const newArr = data.slice();
    const shuffeArr = [];
    while(newArr.length > 0){
        let indexToPush = Math.floor(Math.random()*newArr.length);
        let eltRemove = newArr.splice(indexToPush, 1);
        shuffeArr.push(eltRemove[0]);
    }

    return shuffeArr;
}


function flipImage(data){
    for(let i=0; i < data.length; i++){
        document.getElementById("cardBox_"+i).classList.remove("evil");
        document.getElementById("card_"+i).src = "./images/question.jpg";
    }
}
function gameplay(event){
    let id = event.target.getAttribute("data-index");
    document.getElementById("card_"+Number(id)).src = Characters[Number(id)];
    let elt = document.getElementById("card_"+Number(id)).parentElement;
    if(elt.classList.contains("rollIn")){
        elt.classList.remove("rollIn");
        elt.classList.add("heartBeat", "animatedCard");
    }
    

    gameScore++;
    document.getElementById("clapSound").play();
    //number of devil per level is gameLevel*2+1;
    console.log("gameScore= ", gameScore, " Charac = ", Characters.length, " evil= ", CharactersEvilIndex.length);
    if(gameScore === (Characters.length - CharactersEvilIndex.length)){
        gameLevel += 1;
        document.getElementById("WinSound").play();
        speak(function(){
            return 'Congratulation, you kill it! Click on continue to go to level '+ gameLevel;
        });
        // alert("you win! ready for next level"+gameLevel);
        setTimeout(function(){
            $("#modal_btn").text("Continue");
            $("#modal_title").text("Good Job!!!!");
            $("#modal_body").text("You beat the Devil. You are ready for the next step! \n\n Click Continue to go to");
            $("#myModal").modal({backdrop: true});
            $("#level").text(gameLevel);
            gameScore = 0;
            $("#modal_btn").on("click", function(){
                $("#myModal").modal("hide");
                getGiphy(gameLevel, gameCharacter);
            });
        }, 500);
        //getGiphy(gameLevel);
    }
    
}


function gameOver(){
    let id = event.target.getAttribute("data-index");
    document.getElementById("card_"+Number(id)).src = Characters[Number(id)];
    document.getElementById("LooseSound").play();
    
    setTimeout(function(){
        speak(looser);
        $("#modal_btn").text("Try Again!");
        $("#modal_title").text("You Loose!");
        $("#modal_body").text("You have been catch by the devil!\n Sorry you can't move to the next step\n\n try again and don't click of the devil");
        $("#myModal").modal({backdrop: true});
        gameScore = 0;
        //clearTimeout(gameOverTimeout);
        $("#modal_btn").on("click", function(){
            $("#myModal").modal("hide");
            getGiphy(gameLevel, gameCharacter);
        });
                
    }, 500);
   
}





/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }


  //speech synthesis!!!
  const synth = window.speechSynthesis;

  const speak = (action) => {
    utterThis = new SpeechSynthesisUtterance(action());
    synth.speak(utterThis);
  };

  function populateVoiceList() {
    voices = synth.getVoices();
  
    for(i = 0; i < voices.length ; i++) {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
      
      if(voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }
  
      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voiceSelect.appendChild(option);
    }
  }

  const looser = () => {
    let message = "You must start running because the devil is after you! or click on try again to beat the Devil!";
    return message;
  };

  const getDate = () => {
    const time = new Date(Date.now())
    return `today is ${time.toLocaleDateString()}`;
  };


  //options 
document.getElementById("BackgroundImg").onchange = function(event){
    
    document.body.style.backgroundImage = "url("+event.target.value+")";
}


document.getElementById("CharacterOption").onchange = function(event){
    gameCharacter = event.target.value;
    
}

var typed = new Typed('#typed', {
    stringsElement: '#typed-strings',
    typeSpeed: 50,
    loop: true,
    loopCount: Infinity,

    // fadeOut: true,
    // fadeOutClass: 'typed-fade-out',
    // fadeOutDelay: 500,
  });


