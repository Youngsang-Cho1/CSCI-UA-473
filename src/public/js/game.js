// game.js
document.querySelector(".game").classList.add("hidden");   
document.querySelector(".result").classList.add("hidden");   
document.querySelector(".reset").classList.add("hidden");   
document.querySelector(".error-message").classList.add("hidden");    

const startButton = document.querySelector(".play-btn")


startButton.addEventListener('click', function() {
    const preset = document.querySelector("#card-faces").value
    const cardNum = Number(document.querySelector("#total-cards").value);
    const turnNum = Number(document.querySelector("#max-turns").value);

    const errButton = document.querySelector(".error-btn") 
    errButton.addEventListener('click', function() {
        document.querySelector("#card-faces").value = "";
        document.querySelector("#total-cards").value = "";
        document.querySelector("#max-turns").value = "";
    });
    

    if (cardNum % 2 != 0 || cardNum < 2 || cardNum > 36) {
        document.querySelector(".error-message").classList.remove("hidden");
        return;
    }
    if (!(turnNum >= cardNum/2)){
        document.querySelector(".error-message").classList.remove("hidden");
        return;
    }
    if (preset) {
        const presetList = preset.split(",").map(i => i.trim());
        if (cardNum !== presetList.length) {
            document.querySelector(".error-message").classList.remove("hidden");
            return;
        }
        let evenDict = {}
        for (let i of presetList) {
            if (!evenDict.hasOwnProperty(i)) {
                evenDict[i] = 1;
            }
            else {
                evenDict[i] += 1;
            }
        }
        const validPairs = Object.values(evenDict).every(count => count === 2);
        if (!validPairs) {
            document.querySelector(".error-message").classList.remove("hidden");
            return;
        }
        generateBoard(cardNum, presetList, turnNum)
    }
    //else... random symbols
    
});

function generateBoard(cardNum, symbols, turnNum) {
    document.querySelector(".start").classList.add("hidden");

    const gameBoard = document.querySelector(".game");
    gameBoard.innerHTML = ""; 
    gameBoard.classList.remove("hidden");

    const result = document.querySelector(".result");
    result.innerHTML = "";
    const resultMessage = document.createElement("p");
    resultMessage.classList.add("message");
    const okButton = document.createElement("button");
    okButton.innerText = "OK";
    okButton.classList.add("hidden");
    result.appendChild(resultMessage);
    result.appendChild(okButton);
    
    const columns = Math.ceil(Math.sqrt(cardNum));
    const cardWidth = 80
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, ${cardWidth}px)`;

    let isProcessing = false;
    let flippedCard = [];
    let isMatched = false;
    let turnCounter = 0;
    let matchedCounter = 0;

    const turnUsed = document.createElement("h2");
    gameBoard.parentElement.insertBefore(turnUsed, gameBoard);

    for (let i = 0; i < cardNum; i++) {
        const randomIdx = Math.floor(Math.random() * symbols.length);
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerText = symbols[randomIdx];
        symbols.splice(randomIdx, 1);

        card.addEventListener("click", function() {
            if (isProcessing) return; 
            if (card.classList.contains("flipped")) return; 

            if (!card.classList.contains("flipped") && flippedCard.length < 2) {
                card.classList.add("flipped");
                flippedCard.push(card)
            }
            if (flippedCard.length === 2) {
                isProcessing = true;
                compareCards();
            }

        })
        gameBoard.appendChild(card);
    }

    function compareCards() {
        turnCounter++;
        turnUsed.innerHTML = `Turn Used: ${turnCounter}/${turnNum}`;
        const [card1, card2] = flippedCard;
        if (card1.innerText === card2.innerText) {
            matchedCounter++;
            resultMessage.innerText = "Matches. Press OK";
            result.classList.remove("hidden");
            card1.classList.add("matched");
            card2.classList.add("matched");
            isMatched = true;
        }
        else {
            resultMessage.innerText = "Does not match. Press OK";
            result.classList.remove("hidden");
            isMatched = false;

        }
        okButton.classList.remove("hidden");
    }

    okButton.addEventListener("click", function() {
        okButton.classList.add("hidden");
        resultMessage.innerText = "";
        result.classList.add("hidden");   

        if (matchedCounter * 2 === cardNum) {
            gameBoard.classList.add("hidden")
            result.innerHTML = `You won! <br> Turns: ${turnCounter}/${turnNum}`
            result.style.fontSize = "24px";
            result.style.fontWeight = "bold";
            result.classList.remove("hidden")
            document.querySelector(".reset").classList.remove("hidden");
        }
        else if (turnCounter === turnNum && matchedCounter * 2 !== cardNum) {
            gameBoard.classList.add("hidden")
            result.innerHTML = `You lost! <br> Turns: ${turnCounter}/${turnNum}`
            result.style.fontSize = "24px";
            result.style.fontWeight = "bold";
            result.classList.remove("hidden")
            document.querySelector(".reset").classList.remove("hidden");

        }
        else {
            if (!isMatched) {
                setTimeout(function() {
                    flippedCard[0].classList.remove("flipped");
                    flippedCard[1].classList.remove("flipped");
                    flippedCard = [];
                    isProcessing = false;
                }, 1000);
            }
            else {
                flippedCard = [];
                isProcessing = false;
    
            }
            console.log("Turn:", turnCounter);
        }
    });

    document.querySelector(".reset-btn").addEventListener("click", function() {
        document.querySelector(".game").classList.add("hidden");
        document.querySelector(".result").classList.add("hidden");
        document.querySelector(".reset").classList.add("hidden");
        document.querySelector(".start").classList.remove("hidden");
        turnUsed.remove();
    });
}
// cd desktop/homework06-Youngsang-Cho1
