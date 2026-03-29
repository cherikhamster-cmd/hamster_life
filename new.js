    // ============ GOOGLE SHEETS КОНФИГУРАЦИЯ ============
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwkWbLCOfw6PPZOIwL05_NRA5wK9gAjjsgkyKcFkAc_lbI4FovbIuCCgSIwJd9B3Q3-lQ/exec';
    //https://script.google.com/macros/s/AKfycbxFC8U_0BfYoMpY_FlzrHLmysqX3Rb0MeUYOf6r54UDDePJMS2c4ySNC5rrJwgqVexiSw/exec';
    const QA_SHEET_ID = '1B56gBPEpkmNdGnZ3N2YlGznMq_nHLSuBJEic3erWtDs';
    const QA_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwda2cM0tbBI9GzZHEJvuohCzelI7Yt53arP3zbxtdYojxN39hSV2qE7UUcQ7wHF6IFPg/exec';
    
    let allEntries = [];
    let currentStripPage = 1, currentFullPage = 1;
    const ITEMS_PER_STRIP = 3, ITEMS_PER_FULL = 6;

    // ============ Семечки - ЕДИНЫЙ СЧЕТЧИК ============
    let seedTotal = localStorage.getItem('cherikSeeds') ? parseInt(localStorage.getItem('cherikSeeds')) : 128;
    
    // Обновляем ВСЕ элементы с отображением семечек
    const updateSeedUI = () => {
        // Обновляем блок семечек благодарности
        const seedSpanMain = document.getElementById('seedCount');
        if (seedSpanMain) seedSpanMain.innerText = seedTotal;
        
        // Обновляем футер
        const seedSpanFooter = document.getElementById('seedCountFooter');
        if (seedSpanFooter) seedSpanFooter.innerText = seedTotal;
        
        // Сохраняем в localStorage
        localStorage.setItem('cherikSeeds', seedTotal);
    };
    
    updateSeedUI();
    
    // Кнопка доната
    document.getElementById('donateSeedBtn')?.addEventListener('click', () => {
        seedTotal += 5;
        updateSeedUI();
        alert('🐹 Чирик запищал от радости! +5 семечек!');
    });

    // ============ ЛАБИРИНТ ============
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    let maze = null;
    let playerPos = { x: 1, y: 1 };
    let goalPos = { x: 11, y: 6 };
    let cellSize = 0;
    let cols = 13, rows = 8;
    let gameWon = false;
    
    function initMaze() {
        maze = Array(rows).fill().map(() => Array(cols).fill(false));
        for(let i = 0; i < rows; i++) { maze[i][0] = true; maze[i][cols-1] = true; }
        for(let j = 0; j < cols; j++) { maze[0][j] = true; maze[rows-1][j] = true; }
        
        maze[1][2] = true; maze[2][2] = true; maze[3][2] = true; maze[4][2] = false; maze[5][2] = true; maze[6][2] = true;
        maze[1][3] = false; maze[2][3] = false; maze[3][3] = false; maze[4][3] = false; maze[5][3] = false; maze[6][3] = false;
        maze[1][4] = false; maze[2][4] = true; maze[3][4] = true; maze[4][4] = true; maze[5][4] = true; maze[6][4] = false;
        maze[1][5] = false; maze[2][5] = false; maze[3][5] = false; maze[4][5] = true; maze[5][5] = false; maze[6][5] = false;
        maze[1][6] = true; maze[2][6] = true; maze[3][6] = true; maze[4][6] = false; maze[5][6] = false; maze[6][6] = true;
        maze[1][7] = false; maze[2][7] = false; maze[3][7] = false; maze[4][7] = false; maze[5][7] = true; maze[6][7] = true;
        maze[1][8] = false; maze[2][8] = true; maze[3][8] = true; maze[4][8] = true; maze[5][8] = true; maze[6][8] = true;
        maze[1][9] = false; maze[2][9] = true; maze[3][9] = false; maze[4][9] = false; maze[5][9] = false; maze[6][9] = false;
        maze[1][10] = false; maze[2][10] = true; maze[3][10] = false; maze[4][10] = true; maze[5][10] = false; maze[6][10] = true;
        maze[1][11] = false; maze[2][11] = false; maze[3][11] = false; maze[4][11] = true; maze[5][11] = false; maze[6][11] = false;
        
        playerPos = { x: 1, y: 1 };
        goalPos = { x: 11, y: 6 };
        maze[playerPos.y][playerPos.x] = false;
        maze[goalPos.y][goalPos.x] = false;
        gameWon = false;
    }
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        const maxWidth = Math.min(500, container.clientWidth);
        canvas.style.width = `${maxWidth}px`;
        canvas.width = maxWidth;
        canvas.height = maxWidth * 0.7;
        cellSize = canvas.width / cols;
        drawMaze();
    }
    
    function drawMaze() {
        if(!maze) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let row = 0; row < rows; row++) {
            for(let col = 0; col < cols; col++) {
                let x = col * cellSize;
                let y = row * cellSize;
                if(maze[row][col]) {
                    ctx.fillStyle = '#c8a87c';
                    ctx.fillRect(x, y, cellSize, cellSize);
                    ctx.strokeStyle = '#a57c52';
                    ctx.strokeRect(x, y, cellSize, cellSize);
                } else {
                    ctx.fillStyle = '#fdf8ed';
                    ctx.fillRect(x, y, cellSize, cellSize);
                    ctx.strokeStyle = '#e7cfb2';
                    ctx.strokeRect(x, y, cellSize, cellSize);
                }
            }
        }
        
        ctx.font = `${cellSize * 0.6}px "Segoe UI Emoji"`;
        ctx.fillStyle = '#d68b2c';
        ctx.fillText('🌻', goalPos.x * cellSize + cellSize*0.25, goalPos.y * cellSize + cellSize*0.75);
        ctx.fillStyle = '#b45f2b';
        ctx.fillText('🐹', playerPos.x * cellSize + cellSize*0.25, playerPos.y * cellSize + cellSize*0.75);
        
        if(gameWon) {
            ctx.fillStyle = 'rgba(76,175,80,0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `bold ${cellSize * 0.5}px Arial`;
            ctx.fillStyle = 'white';
            ctx.fillText('🎉 ПОБЕДА! 🎉', canvas.width/3, canvas.height/2);
            document.getElementById('mazeMessage').innerHTML = '<span class="victory-message">✨ Ты помог хомяку! +5 семечек ✨</span>';
        } else {
            document.getElementById('mazeMessage').innerHTML = '';
        }
    }
    
    function tryMove(dx, dy) {
        if(gameWon) return;
        let newX = playerPos.x + dx;
        let newY = playerPos.y + dy;
        if(newX >= 0 && newX < cols && newY >= 0 && newY < rows && !maze[newY][newX]) {
            playerPos = { x: newX, y: newY };
            drawMaze();
            if(playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
                gameWon = true;
                seedTotal += 5;
                updateSeedUI();
                drawMaze();
            }
            return true;
        }
        return false;
    }
    
    function resetMaze() {
        initMaze();
        gameWon = false;
        drawMaze();
    }
    
    function showHint() {
        if(gameWon) return;
        const hintDiv = document.getElementById('mazeMessage');
        hintDiv.innerHTML = '<span style="background:#ffd966; padding:5px 15px; border-radius:40px;">💡 Подсказка: иди вниз, затем вправо, обойди стену и двигайся к семечке! 💡</span>';
        setTimeout(() => {
            if(!gameWon) hintDiv.innerHTML = '';
        }, 4000);
    }
    
    window.addEventListener('keydown', (e) => {
        if(document.getElementById('diaryFullApp').style.display === 'block') return;
        const key = e.key;
        if(key === 'ArrowUp') tryMove(0, -1);
        else if(key === 'ArrowDown') tryMove(0, 1);
        else if(key === 'ArrowLeft') tryMove(-1, 0);
        else if(key === 'ArrowRight') tryMove(1, 0);
        if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key)) e.preventDefault();
    });
    
    let touchStart = null;
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const touch = e.touches[0];
        touchStart = {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if(!touchStart || gameWon) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const touch = e.touches[0];
        const currentX = (touch.clientX - rect.left) * scaleX;
        const currentY = (touch.clientY - rect.top) * scaleY;
        const dx = currentX - touchStart.x;
        const dy = currentY - touchStart.y;
        if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) {
            if(dx > 0) tryMove(1, 0);
            else tryMove(-1, 0);
            touchStart = { x: currentX, y: currentY };
        } else if(Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) {
            if(dy > 0) tryMove(0, 1);
            else tryMove(0, -1);
            touchStart = { x: currentX, y: currentY };
        }
    });
    canvas.addEventListener('touchend', () => { touchStart = null; });
    
    let mouseStart = null;
    canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        mouseStart = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    });
    window.addEventListener('mousemove', (e) => {
        if(!mouseStart || gameWon) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const currentX = (e.clientX - rect.left) * scaleX;
        const currentY = (e.clientY - rect.top) * scaleY;
        const dx = currentX - mouseStart.x;
        const dy = currentY - mouseStart.y;
        if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
            if(dx > 0) tryMove(1, 0);
            else tryMove(-1, 0);
            mouseStart = { x: currentX, y: currentY };
        } else if(Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
            if(dy > 0) tryMove(0, 1);
            else tryMove(0, -1);
            mouseStart = { x: currentX, y: currentY };
        }
    });
    window.addEventListener('mouseup', () => { mouseStart = null; });
    document.getElementById('resetMazeBtn')?.addEventListener('click', () => resetMaze());
    document.getElementById('hintBtn')?.addEventListener('click', () => showHint());
    
    // ============ ДНЕВНИК ============
    async function loadEntriesFromSheets() {
        try {
            const res = await fetch(`${SCRIPT_URL}?action=get`);
            const data = await res.json();
            let entries = Array.isArray(data) ? data : (data.entries || []);
            allEntries = entries.filter(e => e.date && e.text).sort((a,b)=>new Date(b.date)-new Date(a.date));
            renderAll();
        } catch(e) { console.error(e); allEntries = []; renderAll(); }
    }
    
    function renderStripCards() {
        const container = document.getElementById('stripCardsContainer');
        if(!allEntries.length) { container.innerHTML = '<div class="info-message">📭 Пока нет записей</div>'; return; }
        const total = Math.ceil(allEntries.length / ITEMS_PER_STRIP);
        if(currentStripPage > total) currentStripPage = total;
        const start = (currentStripPage-1)*ITEMS_PER_STRIP;
        const page = allEntries.slice(start, start+ITEMS_PER_STRIP);
        container.innerHTML = page.map(e => `<div class="strip-card" data-entry='${JSON.stringify(e).replace(/'/g,"&apos;")}'>
            <div class="card-meta"><span class="card-date">📅 ${e.date}</span><span class="card-mood">${e.mood}</span></div>
            <div class="card-title">${e.title}</div><div class="card-preview">${e.text.substring(0,150)}</div></div>`).join('');
        document.getElementById('pageIndicatorStrip').innerHTML = `Страница ${currentStripPage} из ${total}`;
        document.getElementById('prevPageBtn').disabled = currentStripPage<=1;
        document.getElementById('nextPageBtn').disabled = currentStripPage>=total;
        document.querySelectorAll('.strip-card').forEach(c=>c.onclick=()=>showModal(JSON.parse(c.dataset.entry)));
    }
    
    function renderFullDiary() {
        const container = document.getElementById('fullEntriesList');
        if(!allEntries.length) { container.innerHTML = '<div class="info-message">Нет записей</div>'; return; }
        const total = Math.ceil(allEntries.length / ITEMS_PER_FULL);
        if(currentFullPage > total) currentFullPage = total;
        const start = (currentFullPage-1)*ITEMS_PER_FULL;
        const page = allEntries.slice(start, start+ITEMS_PER_FULL);
        container.innerHTML = page.map(e => `<div class="entry-card-readonly" data-entry='${JSON.stringify(e).replace(/'/g,"&apos;")}'>
            <div>📅 ${e.date} 😊 ${e.mood}</div><h3>${e.title}</h3><div>${e.text.substring(0,100)}...</div></div>`).join('');
        document.getElementById('fullPageInfo').innerText = `Страница ${currentFullPage} из ${total}`;
        document.getElementById('fullPrevBtn').disabled = currentFullPage<=1;
        document.getElementById('fullNextBtn').disabled = currentFullPage>=total;
        document.querySelectorAll('.entry-card-readonly').forEach(c=>c.onclick=()=>showModal(JSON.parse(c.dataset.entry)));
    }
    
    function showModal(entry) {
        let modal = document.getElementById('globalModal');
        if(!modal) { modal = document.createElement('div'); modal.id='globalModal'; modal.className='modal-diary'; document.body.appendChild(modal); }
        modal.innerHTML = `<div class="modal-card"><span class="close-modal" onclick="closeModal()">&times;</span><h3>${entry.title}</h3><div class="modal-meta">📅 ${entry.date} | 😊 ${entry.mood}</div><div class="modal-text">${entry.text.replace(/\n/g,'<br>')}</div><button onclick="closeModal()">Закрыть</button></div>`;
        modal.style.display = 'flex';
    }
    
    window.closeModal = () => { let m = document.getElementById('globalModal'); if(m) m.style.display = 'none'; };
    function renderAll() { renderStripCards(); renderFullDiary(); }
    function showDiary(show) {
        document.getElementById('mainSite').style.display = show ? 'none' : 'block';
        document.getElementById('diaryFullApp').style.display = show ? 'block' : 'none';
        if(show) renderFullDiary();
    }
    
    document.getElementById('prevPageBtn')?.addEventListener('click',()=>{ if(currentStripPage>1){currentStripPage--;renderStripCards();}});
    document.getElementById('nextPageBtn')?.addEventListener('click',()=>{ let max=Math.ceil(allEntries.length/ITEMS_PER_STRIP); if(currentStripPage<max){currentStripPage++;renderStripCards();}});
    document.getElementById('fullPrevBtn')?.addEventListener('click',()=>{ if(currentFullPage>1){currentFullPage--;renderFullDiary();}});
    document.getElementById('fullNextBtn')?.addEventListener('click',()=>{ let max=Math.ceil(allEntries.length/ITEMS_PER_FULL); if(currentFullPage<max){currentFullPage++;renderFullDiary();}});
    document.getElementById('openFullDiaryBtn')?.addEventListener('click',()=>showDiary(true));
    document.getElementById('navDiaryLink')?.addEventListener('click',()=>showDiary(true));
    document.getElementById('backToMainFromDiary')?.addEventListener('click',()=>showDiary(false));
    
    window.addEventListener('resize', () => resizeCanvas());
    initMaze();
    resizeCanvas();
    loadEntriesFromSheets();
    
    window.addEventListener('scroll', () => {
        const scrolled = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        document.getElementById('seedProgress').style.width = scrolled + '%';
    });
    
    // ============ ВОПРОСЫ ============
    const qaForm = document.getElementById('qaForm');
    const qaNameInput = document.getElementById('qaName');
    const qaQuestionInput = document.getElementById('qaQuestion');
    const qaMessageDiv = document.getElementById('qaFormMessage');
    
    async function saveQuestionToSheet(name, question) {
        try {
            const formData = new URLSearchParams();
            formData.append('name', name);
            formData.append('question', question);
            formData.append('timestamp', new Date().toISOString());
            formData.append('sheetId', QA_SHEET_ID);
            
            const response = await fetch(QA_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });
            const result = await response.json();
            return result.success === true;
        } catch(e) {
            console.error('Ошибка сохранения вопроса:', e);
            return false;
        }
    }
    
    function escapeHtml(str) { if(!str) return ''; return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m] || m)); }
    
    qaForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = qaNameInput.value.trim();
        const question = qaQuestionInput.value.trim();
        
        if(!name || !question) {
            qaMessageDiv.innerHTML = '<div class="qa-error">❌ Пожалуйста, заполните имя и вопрос</div>';
            setTimeout(() => qaMessageDiv.innerHTML = '', 3000);
            return;
        }
        
        const submitBtn = qaForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
        
        const success = await saveQuestionToSheet(name, question);
        
        if(success) {
            qaMessageDiv.innerHTML = '<div class="qa-success">✅ Спасибо! Твой вопрос отправлен Черику! 🐹</div>';
            qaNameInput.value = '';
            qaQuestionInput.value = '';
            
            const questionsList = document.getElementById('qaQuestionsList');
            const newQuestionCard = document.createElement('div');
            newQuestionCard.className = 'qa-card';
            newQuestionCard.innerHTML = `<i class="fas fa-quote-left"></i> ${escapeHtml(question)} — <strong>${escapeHtml(name)}</strong><br>— ⏳ Ожидает ответа от Черика!`;
            questionsList.insertBefore(newQuestionCard, questionsList.firstChild);
            if(questionsList.children.length > 6) {
                questionsList.removeChild(questionsList.lastChild);
            }
        } else {
            qaMessageDiv.innerHTML = '<div class="qa-error">❌ Ошибка отправки. Попробуй позже!</div>';
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        setTimeout(() => qaMessageDiv.innerHTML = '', 4000);
    });
