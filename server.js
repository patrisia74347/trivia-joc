const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

const ALL_QUESTIONS = {
    "Istorie": [
        ["Cine a fost primul împărat roman?", ["Iulius Caesar", "Augustus", "Nero", "Traian"], "Augustus"],
        ["În ce an a căzut Zidul Berlinului?", ["1987", "1991", "1989", "1985"], "1989"],
        ["Ce regină a domnit 63 de ani în sec. XIX?", ["Elisabeta I", "Victoria", "Maria", "Ana"], "Victoria"],
        ["Unde a fost asasinat Franz Ferdinand în 1914?", ["Viena", "Sarajevo", "Praga", "Budapesta"], "Sarajevo"],
        ["Navele lui Columb?", ["Niña, Pinta, Santa María", "Victoria, Trinidad", "Discovery"], "Niña, Pinta, Santa María"],
        ["Cine a fost «Regele Soare»?", ["Ludovic XVI", "Carol cel Mare", "Ludovic XIV", "Henric VIII"], "Ludovic XIV"],
        ["Ce civilizație a construit Machu Picchu?", ["Aztecii", "Mayașii", "Incașii", "Olmecii"], "Incașii"],
        ["Anul Marii Uniri a României?", ["1859", "1877", "1918", "1922"], "1918"],
        ["Ultimul țar al Rusiei?", ["Alexandru III", "Nicolae II", "Pavel I", "Petru cel Mare"], "Nicolae II"],
        ["Cod de legi din Babilon?", ["Justinian", "Hammurabi", "Manu", "Solon"], "Hammurabi"]
    ],
    "Geografie": [
        ["Cel mai lung fluviu din lume?", ["Amazon", "Nil", "Dunărea", "Mississippi"], "Nil"],
        ["Capitala Canadei?", ["Toronto", "Vancouver", "Ottawa", "Montreal"], "Ottawa"],
        ["Cel mai mic stat din lume?", ["Monaco", "San Marino", "Vatican", "Andorra"], "Vatican"],
        ["Strâmtoarea dintre Europa și Africa?", ["Dardanele", "Bering", "Gibraltar", "Magellan"], "Gibraltar"],
        ["Continentul fără furnici?", ["Australia", "Antarctica", "Africa", "Europa"], "Antarctica"],
        ["În ce ocean sunt Insulele Bermude?", ["Pacific", "Indian", "Arctic", "Atlantic"], "Atlantic"],
        ["Cel mai înalt vârf din Africa?", ["Mont Blanc", "Kilimanjaro", "K2", "Everest"], "Kilimanjaro"],
        ["Orașul prin care trece meridianul zero?", ["Paris", "New York", "Londra", "Tokyo"], "Londra"],
        ["Cea mai mare țară din lume?", ["China", "SUA", "Rusia", "Canada"], "Rusia"],
        ["Lacul cu cea mai mare adâncime?", ["Caspic", "Superior", "Baikal", "Victoria"], "Baikal"]
    ],
    "Știință": [
        ["Cel mai greu element natural?", ["Plumb", "Aur", "Uraniu", "Mercur"], "Uraniu"],
        ["Câte planete au inele?", ["2", "3", "4", "1"], "4"],
        ["Cel mai mare organ al corpului?", ["Ficatul", "Creierul", "Pielea", "Inima"], "Pielea"],
        ["Viteza luminii în vid (km/s)?", ["150.000", "200.000", "300.000", "400.000"], "300.000"],
        ["Din ce element e diamantul?", ["Siliciu", "Carbon", "Azot", "Fier"], "Carbon"],
        ["Singurul mamifer care zboară?", ["Veverița", "Liliacul", "Pinguinul", "Cârtița"], "Liliacul"],
        ["Autorul Teoriei Relativității?", ["Newton", "Tesla", "Hawking", "Einstein"], "Einstein"],
        ["Steaua cea mai apropiată (după Soare)?", ["Sirius", "Polaris", "Proxima Centauri", "Vega"], "Proxima Centauri"],
        ["Grupa de sânge - donator universal?", ["A", "B", "AB", "0"], "0"],
        ["Gazul predominant în atmosfera Terrei?", ["Oxigen", "Azot", "CO2", "Argon"], "Azot"]
    ],
    "Sport": [
        ["Minute repriză fotbal?", ["40", "45", "50", "35"], "45"],
        ["Cele mai multe CM fotbal câștigate?", ["Germania", "Italia", "Brazilia", "Argentina"], "Brazilia"],
        ["Recordman 100m plat?", ["Bolt", "Gay", "Lewis", "Blake"], "Bolt"],
        ["Primele JO moderne (1896)?", ["Paris", "Roma", "Atena", "Londra"], "Atena"],
        ["Mari Șlemuri de tenis pe an?", ["2", "3", "4", "5"], "4"],
        ["Numărul lui Michael Jordan?", ["32", "23", "10", "45"], "23"],
        ["Culoarea tricoului liderului în Turul Franței?", ["Roșu", "Verde", "Galben", "Alb"], "Galben"],
        ["Jucători de baschet pe teren (o echipă)?", ["4", "5", "6", "7"], "5"],
        ["Prima gimnastă cu nota 10?", ["Biles", "Comăneci", "Korbut", "Latînina"], "Comăneci"],
        ["Sportul în care se câștigă Stanley Cup?", ["Hochei", "Baseball", "Golf", "Polo"], "Hochei"]
    ],
    "Tehnologie": [
        ["Fondator Microsoft?", ["Jobs", "Gates", "Musk", "Zuck"], "Gates"],
        ["Ce înseamnă WWW?", ["World Wide Web", "Wide Web World", "Web World Wide"], "World Wide Web"],
        ["Lansarea primului iPhone?", ["2005", "2007", "2009", "2010"], "2007"],
        ["Limbaj de programare cu nume de șarpe?", ["Java", "Python", "C++", "Ruby"], "Python"],
        ["Cine a cumpărat Twitter în 2022?", ["Bezos", "Gates", "Elon Musk", "Zuck"], "Elon Musk"],
        ["Ce înseamnă HTTP?", ["HyperText Transfer Protocol", "High Text", "Hyper Tool"], "HyperText Transfer Protocol"],
        ["Compania care produce procesoarele Ryzen?", ["Intel", "Nvidia", "AMD", "Apple"], "AMD"],
        ["Prima criptomonedă?", ["Ethereum", "Bitcoin", "Ripple", "Litecoin"], "Bitcoin"],
        ["Browser creat de Google?", ["Safari", "Firefox", "Chrome", "Edge"], "Chrome"],
        ["Unitatea de bază a memoriei computerului?", ["Bit", "Byte", "Hertz", "Watt"], "Byte"]
    ],
    "Filme": [
        ["Regizorul Titanic?", ["Spielberg", "Cameron", "Nolan", "Scorsese"], "Cameron"],
        ["Câte premii Oscar are Stăpânul Inelelor 3?", ["9", "10", "11", "12"], "11"],
        ["Actorul din Indiana Jones?", ["Tom Cruise", "Harrison Ford", "Brad Pitt"], "Harrison Ford"],
        ["Cine a regizat Jaws?", ["Spielberg", "Lucas", "Coppola", "Tarantino"], "Spielberg"],
        ["Orașul în care locuiește Batman?", ["Metropolis", "Gotham", "Central City"], "Gotham"],
        ["Prima animație lungmetraj Disney?", ["Cenușăreasa", "Albă ca Zăpada", "Bambi"], "Albă ca Zăpada"],
        ["Actorul din pirații din Caraibe (Jack)?", ["Depp", "Bloom", "Pitt", "Hanks"], "Depp"],
        ["Filmul cu cele mai mari încasări?", ["Avatar", "Endgame", "Titanic", "Star Wars"], "Avatar"],
        ["Câte filme are seria originală Star Wars?", ["2", "3", "6", "9"], "3"],
        ["Numele leului din Regele Leu?", ["Simba", "Mufasa", "Scar", "Timon"], "Simba"]
    ],
    "Muzică": [
        ["Regele Rock-and-Roll?", ["Elvis Presley", "Chuck Berry", "Little Richard"], "Elvis Presley"],
        ["Țara trupei ABBA?", ["Norvegia", "Danemarca", "Suedia", "Finlanda"], "Suedia"],
        ["Cel mai vândut album din toate timpurile?", ["Thriller", "Back in Black", "Dark Side"], "Thriller"],
        ["Câți membri avea trupa Queen?", ["3", "4", "5", "6"], "4"],
        ["Cine a compus Oda Bucuriei?", ["Mozart", "Beethoven", "Bach", "Wagner"], "Beethoven"],
        ["Instrumentul lui Mozart?", ["Vioară", "Pian", "Flaut", "Clarinet"], "Pian"],
        ["Regele muzicii Pop?", ["Prince", "Michael Jackson", "Justin Timberlake"], "Michael Jackson"],
        ["Stilul muzical al lui Bob Marley?", ["Rock", "Reggae", "Jazz", "Blues"], "Reggae"],
        ["Câte corzi are o vioară standard?", ["3", "4", "5", "6"], "4"],
        ["Numele real al lui Lady Gaga?", ["Stefani Germanotta", "Robyn Fenty", "Katy Hudson"], "Stefani Germanotta"]
    ],
    "Mitologie": [
        ["Zeu suprem la greci?", ["Zeus", "Poseidon", "Hades", "Ares"], "Zeus"],
        ["Zeița frumuseții (romani)?", ["Venus", "Minerva", "Diana", "Juno"], "Venus"],
        ["Câte munci a avut Hercule?", ["10", "12", "15", "7"], "12"],
        ["Zeul șacal (Egipt)?", ["Ra", "Osiris", "Anubis", "Horus"], "Anubis"],
        ["Raiul luptătorilor vikingi?", ["Asgard", "Valhalla", "Midgard", "Hel"], "Valhalla"],
        ["Cine l-a învins pe Minotaur?", ["Hercule", "Tezeu", "Perseu", "Ahile"], "Tezeu"],
        ["Râul morților în Grecia?", ["Nil", "Styx", "Eridan", "Lethe"], "Styx"],
        ["Zeița vânătorii (greacă)?", ["Artemis", "Athena", "Aphrodite", "Hera"], "Artemis"],
        ["Cine a furat focul de la zei?", ["Icar", "Prometeu", "Sisif", "Tantal"], "Prometeu"],
        ["Monstrul cu privirea care pietrifică?", ["Sfinx", "Medusa", "Hidra", "Chimeră"], "Medusa"]
    ],
    "Corpul Uman": [
        ["Câte oase are un adult?", ["150", "206", "300", "215"], "206"],
        ["Câte inimi are o caracatiță?", ["1", "2", "3", "4"], "3"],
        ["Cel mai mare os din corp?", ["Femur", "Tibie", "Humerus", "Craniu"], "Femur"],
        ["Unde se află cele mai mici oase?", ["Mână", "Ureche", "Picior", "Nas"], "Ureche"],
        ["Ce organ produce insulina?", ["Ficat", "Pancreas", "Splină", "Rinichi"], "Pancreas"],
        ["Câte grupe sanguine principale sunt?", ["2", "3", "4", "8"], "4"],
        ["Substanța care dă culoare pielii?", ["Melanina", "Hemoglobina", "Clorofila"], "Melanina"],
        ["Câte emisfere are creierul?", ["1", "2", "3", "4"], "2"],
        ["Care e rolul globulelor roșii?", ["Imunitate", "Transport oxigen", "Coagulare"], "Transport oxigen"],
        ["Cel mai puternic mușchi (după presiune)?", ["Biceps", "Inimă", "Maseter (maxilar)", "Limbă"], "Maseter (maxilar)"]
    ],
    "Diverse": [
        ["Culoarea curcubeului (număr)?", ["5", "6", "7", "8"], "7"],
        ["Metalul lichid la temperatura camerei?", ["Plumb", "Mercur", "Galiu", "Zinc"], "Mercur"],
        ["Laturi are un octogon?", ["6", "8", "10", "12"], "8"],
        ["Mierea se strică în timp?", ["Da", "Nu", "Doar dacă are zahăr"], "Nu"],
        ["Țara cu cele mai multe fusuri orare?", ["Rusia", "SUA", "Franța", "China"], "Franța"],
        ["Culoarea cutiei negre a avioanelor?", ["Neagră", "Portocalie", "Albă", "Roșie"], "Portocalie"],
        ["Din ce se face hârtia?", ["Lemn", "Plastic", "Piatră", "Sticlă"], "Lemn"],
        ["Cea mai vândută jucărie?", ["Barbie", "LEGO", "Cubul Rubik", "Hot Wheels"], "Cubul Rubik"],
        ["În ce an s-a scufundat Titanicul?", ["1905", "1912", "1920", "1910"], "1912"],
        ["Capitala Japoniei?", ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], "Tokyo"]
    ]
};

let players = [];
let gameQuestions = [];
let currentQuestionIndex = 0;
let finalSelectedCategories = [];
let turnIndex = 0;

io.on('connection', (socket) => {
    socket.on('join_game', (name) => {
        if (players.length < 2) {
            players.push({ id: socket.id, name, score: 0, responded: false });
            io.emit('update_players', players);
        }
        if (players.length === 2) {
            finalSelectedCategories = [];
            turnIndex = 0;
            io.emit('start_selection', { 
                categories: Object.keys(ALL_QUESTIONS), 
                currentPlayerId: players[turnIndex].id, 
                currentPlayerName: players[turnIndex].name 
            });
        }
    });

    socket.on('category_picked', (category) => {
        if (socket.id !== players[turnIndex].id) return;
        if (finalSelectedCategories.includes(category)) return;
        
        finalSelectedCategories.push(category);
        turnIndex = (turnIndex === 0) ? 1 : 0;
        
        if (finalSelectedCategories.length < 6) {
            io.emit('next_turn', { 
                picked: finalSelectedCategories, 
                currentPlayerId: players[turnIndex].id, 
                currentPlayerName: players[turnIndex].name 
            });
        } else {
            prepareGame();
        }
    });

    socket.on('submit_answer', (answer) => {
        const p = players.find(pl => pl.id === socket.id);
        if (!p || p.responded) return;
        
        const currentQ = gameQuestions[currentQuestionIndex - 1];
        if (currentQ && answer === currentQ.c) p.score += 10;
        p.responded = true;

        if (players.every(pl => pl.responded)) {
            io.emit('update_players', players);
            setTimeout(sendQuestion, 2000);
        }
    });

    socket.on('disconnect', () => { players = []; finalSelectedCategories = []; });
});

function prepareGame() {
    gameQuestions = [];
    finalSelectedCategories.forEach(cat => {
        let pool = ALL_QUESTIONS[cat] || [];
        let selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, 2);
        selected.forEach(q => gameQuestions.push({ q: q[0], a: q[1], c: q[2], cat: cat }));
    });
    gameQuestions.sort(() => 0.5 - Math.random());
    currentQuestionIndex = 0;
    io.emit('selection_complete');
    setTimeout(sendQuestion, 1000);
}

function sendQuestion() {
    if (currentQuestionIndex < gameQuestions.length) {
        players.forEach(p => p.responded = false);
        io.emit('next_question', { question: gameQuestions[currentQuestionIndex], number: currentQuestionIndex + 1, total: gameQuestions.length });
        currentQuestionIndex++;
    } else {
        let winnerId = "draw";
        if(players[0] && players[1]) {
            if(players[0].score > players[1].score) winnerId = players[0].id;
            else if(players[1].score > players[0].score) winnerId = players[1].id;
        }
        io.emit('game_over', { players, winnerId });
    }
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server activ pe portul ${PORT}`));
