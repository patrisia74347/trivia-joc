<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trivia Arena Royale</title>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <style>
        :root { --primary: #7c3aed; --secondary: #a855f7; --accent: #fbbf24; --bg: #050510; --card-bg: rgba(20, 20, 45, 0.9); }
        body { margin: 0; background: radial-gradient(circle at center, #1a1a35 0%, #050510 100%); color: white; font-family: 'Segoe UI', sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 20px; }
        .container { width: 100%; max-width: 800px; }
        .card { background: var(--card-bg); border: 2px solid #2d2d5a; border-radius: 20px; padding: 30px; backdrop-filter: blur(10px); text-align: center; margin-top: 20px; }
        .btn, .ans-btn, .cat-btn { cursor: pointer; transition: 0.3s; font-weight: bold; border-radius: 8px; }
        .btn { background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; padding: 12px 25px; color: white; width: 100%; max-width: 300px; }
        .ans-btn { display: block; width: 100%; background: #1a1a35; border: 1px solid #2d2d5a; padding: 18px; margin: 10px 0; color: white; text-align: left; font-size: 1.1rem; }
        .ans-btn:hover { background: #2d2d5a; border-color: var(--primary); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin: 20px 0; }
        .cat-btn { background: #1a1a35; border: 1px solid #2d2d5a; padding: 15px; color: #9090b8; }
        .cat-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(251, 191, 36, 0.1); }
        #scores { font-size: 1.5rem; color: var(--accent); margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>

<div class="container">
    <h1 style="text-align: center;">TRIVIA ARENA</h1>

    <div id="login-screen" class="card">
        <input type="text" id="username" placeholder="Porecla ta..." style="padding:12px; border-radius:8px; width:80%;">
        <br><br><button class="btn" onclick="join()">START JOC</button>
    </div>

    <div id="selection-screen" class="card" style="display:none;">
        <h2 id="turn-info">Se așteaptă jucătorii...</h2>
        <div class="grid" id="category-list"></div>
    </div>

    <div id="game-screen" style="display:none;">
        <div id="scores"></div>
        <div class="card">
            <div id="q-meta" style="color: var(--secondary); font-weight: bold;"></div>
            <h2 id="q-text">Pregătim întrebarea...</h2>
            <div id="options"></div>
        </div>
    </div>

    <div id="result-screen" class="card" style="display:none;">
        <h1 id="final-status"></h1>
        <div id="final-scores"></div>
        <button class="btn" onclick="location.reload()">REVANȘĂ</button>
    </div>
</div>

<script>
    const socket = io();
    let myId = null;

    function join() {
        const name = document.getElementById('username').value;
        if(name) {
            socket.emit('join_game', name);
            document.getElementById('login-screen').style.display = 'none';
        }
    }

    socket.on('update_players', (players) => {
        const s = document.getElementById('scores');
        if(s) s.innerText = players.map(p => `${p.name}: ${p.score}`).join(' VS ');
    });

    socket.on('start_selection', (data) => {
        document.getElementById('selection-screen').style.display = 'block';
        window.allCats = data.categories;
        renderCategories([], data.currentPlayerId, data.currentPlayerName);
    });

    socket.on('next_turn', (data) => {
        renderCategories(data.picked, data.currentPlayerId, data.currentPlayerName);
    });

    function renderCategories(picked, currentId, name) {
        const list = document.getElementById('category-list');
        const info = document.getElementById('turn-info');
        
        info.innerText = (currentId === socket.id) ? "E RÂNDUL TĂU!" : `ALEGE ${name}...`;
        
        list.innerHTML = window.allCats.map(cat => {
            const isPicked = picked.includes(cat);
            return `<button class="cat-btn ${isPicked ? 'active' : ''}" 
                    ${(isPicked || currentId !== socket.id) ? 'disabled' : ''} 
                    onclick="socket.emit('category_picked', '${cat}')">${cat}</button>`;
        }).join('');
    }

    socket.on('selection_complete', () => {
        document.getElementById('selection-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
    });

    socket.on('next_question', (data) => {
        document.getElementById('q-meta').innerText = `RUNDA ${data.number}/${data.total} • ${data.question.cat}`;
        document.getElementById('q-text').innerText = data.question.q;
        const optDiv = document.getElementById('options');
        optDiv.innerHTML = '';
        data.question.a.forEach(opt => {
            const b = document.createElement('button');
            b.className = 'ans-btn';
            b.innerText = opt;
            b.onclick = () => {
                socket.emit('submit_answer', opt);
                optDiv.innerHTML = "<h3>Răspuns trimis! Așteptăm adversarul...</h3>";
            };
            optDiv.appendChild(b);
        });
    });

    socket.on('game_over', (data) => {
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('result-screen').style.display = 'block';
        const h = document.getElementById('final-status');
        const win = (data.winnerId === socket.id);
        h.innerText = data.winnerId === "draw" ? "EGALITATE" : (win ? "AI CÂȘTIGAT! 🏆" : "AI PIERDUT! 💀");
        document.getElementById('final-scores').innerText = data.players.map(p => `${p.name}: ${p.score}`).join(' - ');
    });
</script>
</body>
</html>
