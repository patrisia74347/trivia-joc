const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

const ALL_QUESTIONS = {
    "Istorie Universală": [
        ["Cine a fost primul împărat al Imperiului Roman?", ["Iulius Caesar", "Augustus", "Nero", "Traian"], "Augustus"],
        ["În ce an a căzut Zidul Berlinului?", ["1987", "1991", "1989", "1985"], "1989"]
    ],
    "Geografie": [
        ["Care este cel mai lung fluviu din lume?", ["Amazon", "Nil", "Dunărea", "Mississippi"], "Nil"],
        ["Care este capitala Canadei?", ["Toronto", "Vancouver", "Ottawa", "Montreal"], "Ottawa"]
    ],
    "Știință și Natură": [
        ["Cel mai mare organ al corpului?", ["Ficatul", "Creierul", "Plămânii", "Pielea"], "Pielea"],
        ["Viteza luminii în vid?", ["150.000 km/s", "200.000 km/s", "300.000 km/s", "450.000 km/s"], "300.000 km/s"]
    ],
    "Artă și Literatură": [
        ["Cina cea de Taină?", ["Michelangelo", "Rafael", "Picasso", "Leonardo da Vinci"], "Leonardo da Vinci"],
        ["Hamlet?", ["Dickens", "Twain", "Austen", "William Shakespeare"], "William Shakespeare"]
    ],
    "Sport": [
        ["Durată repriză fotbal?", ["40", "50", "35", "45"], "45"],
        ["Primele JO moderne (1896)?", ["Paris", "Londra", "Roma", "Atena"], "Atena"]
    ],
    "Tehnologie și Internet": [
        ["Fondator Microsoft?", ["Steve Jobs", "Zuckerberg", "Elon Musk", "Bill Gates"], "Bill Gates"],
        ["WWW?", ["Wide Web Window", "World Wide Web", "Web World Wide", "Wireless"], "World Wide Web"]
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
            io.emit('next_turn', { picked: finalSelectedCategories, currentPlayerId: players[turnIndex].id, currentPlayerName: players[turnIndex].name });
        } else {
            prepareGame();
        }
    });

    socket.on('submit_answer', (answer) => {
        const p = players.find(pl => pl.id === socket.id);
        if (!p || p.responded) return;
        
        const currentQ = gameQuestions[currentQuestionIndex - 1];
        if (answer === currentQ.c) p.score += 10;
        p.responded = true;

        if (players.every(pl => pl.responded)) {
            io.emit('update_players', players);
            setTimeout(sendQuestion, 2000);
        }
    });

    socket.on('disconnect', () => { players = players.filter(p => p.id !== socket.id); });
});

function prepareGame() {
    gameQuestions = [];
    finalSelectedCategories.forEach(cat => {
        let pool = ALL_QUESTIONS[cat];
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
        if(players.length === 2) {
            if(players[0].score > players[1].score) winnerId = players[0].id;
            else if(players[1].score > players[0].score) winnerId = players[1].id;
        }
        io.emit('game_over', { players, winnerId });
    }
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server activ pe portul ${PORT}`));
