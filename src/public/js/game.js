// game.js
const startButton = document.querySelector(".play-btn")


startButton.addEventListener('click', function() {
    const preset = document.querySelector("#card-faces").value
    const cardNum = Number(document.querySelector("#total-cards").value);
    const turnNum = Number(document.querySelector("#max-turns").value);
    let counter = cardNum/2;

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
        generateBoard(cardNum, presetList, counter)
    }
    //else... random symbols
    
});

function generateBoard(cardNum, symbols, counter) {
    const gameBoard = document.querySelector(".game");
    const result = document.querySelector(".result");

    gameBoard.style.display = "grid";

    let flippedCard = [];

    for (let i = 0; i < cardNum; i++) {
        const randomIdx = Math.floor(Math.random() * symbols.length);
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerText = symbols[randomIdx];
        symbols.splice(randomIdx, 1);

        card.addEventListener("click", function() {
            if (!card.classList.contains("flipped") && flippedCard.length < 2) {
                card.classList.toggle("flipped");
                flippedCard.push(card)
            }
            if (flippedCard.length === 2) {
                if (flippedCard[0].innerText === flippedCard[1].innerText) {
                    result.innerText = "Matches. Press OK";
                }
                else {
                    result.innerText = "Does not match. Press OK";
                }
                flippedCard = []
                counter++;
            }

        })
        gameBoard.appendChild(card);
    }

}
// cd desktop/homework06-Youngsang-Cho1
