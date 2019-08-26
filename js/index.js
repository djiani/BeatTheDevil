

const Devil = 'https://media.giphy.com/media/l3V0BFYUP1OUsYoMw/giphy.gif';
//const characters = ["superhero", "dogs", "cats", "tom and jerry", "flogs", "clown"];

const url = "https://api.giphy.com/v1/gifs/search?api_key=5f2qiYkKasRM65bApSg9R42vbXi57BSJ&q=";
const Images= ["emoji_1.jpg", "emoji_2.jpg", "emoji_3.jpg", "emoji_4.jpg", "devil_2.jpg","emoji_5.jpg" ];
let Characters = [];
let CharactersEvilIndex = [];
let gameScore = 0;
let gameLevel = 1;
function getGiphy(level){
    const promiseImg = [search(level*3 + 5, "cats"), search(level*2, 'devil')]
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

function search(num, query){
    return fetch(url+query+"&limit="+num)
    .then(response => response.json());
}

getGiphy(gameLevel);
//console.log(images);
function displayImages(data, devilIndex){
    
    let listImg = data.map((img, i) => {
        //console.log(img);
        //return `<div class='cardImg'><img src="./images/${img}" class="imgSize"/></div>`
        if(devilIndex.includes(i)){
            return `<div class='cardImg evil' id="cardBox_${i}" ><img src="${img}" id="card_${i}" class="imgSize" data-index ="${i}"}/></div>`;
        }else{
            return `<div class='cardImg' id="cardBox_${i}" ><img src="${img}" id="card_${i}" class="imgSize" data-index ="${i}" }/></div>`;
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
    gameScore++;

    //number of devil per level is gameLevel*2+1;
    console.log("gameScore= ", gameScore, " Charac = ", Characters.length, " evil= ", CharactersEvilIndex.length);
    if(gameScore === (Characters.length - CharactersEvilIndex.length)){
        gameLevel += 1;
        // alert("you win! ready for next level"+gameLevel);
        setTimeout(function(){
            alert("you win! ready for next level"+gameLevel);
            gameScore = 0;
            getGiphy(gameLevel);
        }, 500);
        //getGiphy(gameLevel);
    }
    
}

function gameOver(){
    let id = event.target.getAttribute("data-index");
    document.getElementById("card_"+Number(id)).src = Characters[Number(id)];
    setTimeout(function(){
        alert("You lost! try again. you must win to move to next step");
        gameScore = 0;
        getGiphy(gameLevel);
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
