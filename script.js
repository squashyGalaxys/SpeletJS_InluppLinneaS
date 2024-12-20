const cards = document.querySelectorAll(".card");

// Globala variabler för att hantera spelets tillstånd
let cardOne, cardTwo; // Variabler för de två kort som spelaren klickar på
let disableDeck = false; // Flagga för att förhindra att fler kort vänds medan två kort är öppna
let matchedCard = 0; // Räknare för antalet matchade par
let flips = 0; // Räknare för antalet försök att matcha par
let gameStarted = false; // Flagga för att kontrollera om spelet har startat (för att starta timern)
let timeLeft; // Variabel för att hålla reda på den återstående tiden
let timer; // Variabel för setInterval-funktionen
let selectedTime; // Variabel för att lagra det valda tidsintervallet

// Funktion som hanterar klick på kort
function flipCard(e) {
    if (!gameStarted) {
        startTimer(); // Starta timern vid första klick
        gameStarted = true;
    }

    let clickedCard = e.currentTarget; // Det kort som har klickats på

    if (clickedCard !== cardOne && !disableDeck) {
        clickedCard.classList.add("flip"); // Lägg till klassen "flip" för att visa kortets baksida
        if (!cardOne) {
            cardOne = clickedCard; // Sätt första kortet
            return;
        }
        cardTwo = clickedCard; // Sätt andra kortet
        disableDeck = true; // Förhindra att fler kort vänds medan två kort är öppna

        let cardOneImg = cardOne.querySelector(".back-view img").src;
        let cardTwoImg = cardTwo.querySelector(".back-view img").src;
        
        flips++; // Öka antalet försök att matcha par
        document.getElementById('numberOfFlips').querySelector('b').textContent = flips; // Uppdatera UI med antalet försök

        matchCards(cardOneImg, cardTwoImg); // Kontrollera om korten matchar
    }
}

// Funktion för att jämföra två korts bilder
function matchCards(img1, img2) {
    if (img1 === img2) {
        matchedCard++; // Öka antalet matchade par
        if (matchedCard == 8) { // Om alla par har matchats
            clearInterval(timer); // Stoppa timern
            setTimeout(() => alert('Grattis! du hittade alla par.'), 300);
            return;
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = null;
        disableDeck = false; // Tillåt nya klick
    } else {
        
        setTimeout(() => {
            cardOne.classList.remove("flip");
            cardTwo.classList.remove("flip");
            cardOne = cardTwo = null;
            disableDeck = false; // Tillåt nya klick
        }, 1200);
    }
}

// Funktion för nedräkning av tid
function countdown() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById('timeLeftDisplay').textContent = timeLeft; // Uppdatera visning av tiden kvar
    } else {
        clearInterval(timer);
        alert('Tiden är ute! Spelet är över.');
        resetGame();
    }
}

// Funktion för att starta timern
function startTimer() {
    selectedTime = parseInt(document.getElementById('timeSelect').value); // Hämta valt tidsvärde
    timeLeft = selectedTime; // Ställ in timeLeft till valt tidsvärde
    document.getElementById('timeLeftDisplay').textContent = timeLeft; // Visa initial tid

    timer = setInterval(countdown, 1000); // Starta nedräkning
}

// Funktion för att starta om spelet
function startGame() {
    clearInterval(timer); // Stoppa timern om den redan går
    flips = 0; // Nollställ antalet försök
    document.getElementById('numberOfFlips').querySelector('b').textContent = flips;
    document.getElementById('timeLeftDisplay').textContent = '--'; // Återställ visning av tiden kvar

    gameStarted = false; // Återställ gameStarted flaggan

    resetGame(); // Återställ spelet
}

// Funktion för att återställa spelet
function resetGame() {
    cardOne = cardTwo = "";
    disableDeck = false;
    matchedCard = 0;
    cards.forEach(card => {
        card.classList.remove("flip");
        card.addEventListener("click", flipCard);
    });
    shuffleCards(); // Blanda korten
}

// Funktion för att blanda korten
function shuffleCards() {
    let arr = ['img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img1', 'img2', 'img3', 'img4', 'img5', 'img6'];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1); // Random sortering av korten

    cards.forEach((card, index) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `img/${arr[index]}.jpg`;
        card.addEventListener("click", flipCard);
    });
}

// Initialisering: blanda korten och koppla klickhändelser
shuffleCards();
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});
