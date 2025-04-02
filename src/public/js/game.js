// game.js
const startButton = document.querySelector(".play-btn")

startButton.addEventListener('click', function() {
    const preset = document.querySelector("#card-faces").value
    const cardNum = Number(document.querySelector("#total-cards").value);
    const turnNum = Number(document.querySelector("#max-turns").value);

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
    }
    // gamefunction....
});
