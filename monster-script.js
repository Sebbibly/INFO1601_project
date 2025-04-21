let currentOffset = 0;
const monstersPerPage = 15;
let allMonsters = [];

const monsterList = document.getElementById('monsterResult');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const monsterInput = document.getElementById('monsterInput');
const searchButton = document.getElementById('searchButton');


const loadingElement = document.createElement('div');
loadingElement.id = 'loading';
loadingElement.className = 'hidden';
loadingElement.textContent = 'Loading...';
document.querySelector('.container').appendChild(loadingElement);

async function fetchMonsters() {
    loadingElement.classList.remove('hidden');
    monsterList.innerHTML = '';
    
    try {
        const response = await fetch('https://www.dnd5eapi.co/api/monsters');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        allMonsters = data.results;
        displayMonsters();
    } catch (error) {
        console.error('Error fetching monsters:', error);
        monsterList.innerHTML = `<p class="error">Error loading monsters: ${error.message}</p>`;
    } finally {
        loadingElement.classList.add('hidden');
    }
}

function displayMonsters() {
    monsterList.innerHTML = '';
    const startIdx = currentOffset * monstersPerPage;
    const endIdx = startIdx + monstersPerPage;
    const monstersToShow = allMonsters.slice(startIdx, endIdx);
    
    if (monstersToShow.length === 0) {
        monsterList.innerHTML = '<p>No monsters found</p>';
        return;
    }
    
    monstersToShow.forEach(monster => {
        const monsterElement = document.createElement('div');
        monsterElement.className = 'monster-item';
        monsterElement.innerHTML = `
            <div class="monster-header" onclick="toggleMonsterDetails('${monster.index}')">
                ${monster.name}
            </div>
            <div class="monster-details" id="details-${monster.index}"></div>
        `;
        monsterList.appendChild(monsterElement);
    });
    
    
    prevButton.disabled = currentOffset === 0;
    nextButton.disabled = endIdx >= allMonsters.length;
}

async function toggleMonsterDetails(monsterIndex) {
    const detailsElement = document.getElementById(`details-${monsterIndex}`);
    
    if (detailsElement.innerHTML) { 
        detailsElement.style.maxHeight = detailsElement.style.maxHeight ? null : `${detailsElement.scrollHeight}px`;
        return;
      }

    detailsElement.innerHTML = '<p>Loading details...</p>';
    detailsElement.style.display = 'block';

    try {
        const response = await fetch(`https://www.dnd5eapi.co/api/monsters/${monsterIndex}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const monsterData = await response.json();
        
        let detailsHTML = '';
        
       
      
        detailsHTML += `
            <div class="ability-scores">
                <p style="text-align:center"><strong>Ability Scores:</strong></p>
                <div class="ability-grid">
                    <div>STR: ${monsterData.strength}</div>
                    <div>DEX: ${monsterData.dexterity}</div>
                    <div>CON: ${monsterData.constitution}</div>
                    <div>INT: ${monsterData.intelligence}</div>
                    <div>WIS: ${monsterData.wisdom}</div>
                    <div>CHA: ${monsterData.charisma}</div>
                </div>
            </div>
            <br>
        `;

       detailsHTML += `<p><strong>Hit Points:</strong> ${monsterData.hit_points} (${monsterData.hit_points_roll})</p>`;
        
        
        if (monsterData.armor_class && monsterData.armor_class.length > 0) {
            detailsHTML += `<p><strong>Armor Class:</strong> ${monsterData.armor_class[0].value} (${monsterData.armor_class[0].type})</p>`;
        }
        
        detailsHTML += `<p><strong>Type:</strong> ${monsterData.size} ${monsterData.type}</p>`;
        detailsHTML += `<p><strong>XP:</strong> ${monsterData.xp}</p>`;
        



        detailsElement.innerHTML = detailsHTML;
    } catch (error) {
        console.error('Error fetching monster details:', error);
        detailsElement.innerHTML = `<p class="error">Error loading monster details: ${error.message}</p>`;
    }
}

function searchMonsters() {
    const searchTerm = monsterInput.value.toLowerCase().trim();
    if (searchTerm === '') {
        currentOffset = 0;
        fetchMonsters();
        return;
    }
    
    const filteredMonsters = allMonsters.filter(monster => 
        monster.name.toLowerCase().includes(searchTerm)
    );
    
    monsterList.innerHTML = '';
    
    if (filteredMonsters.length === 0) {
        monsterList.innerHTML = '<p>No monsters match your search</p>';
        prevButton.disabled = true;
        nextButton.disabled = true;
        return;
    }
    
    filteredMonsters.forEach(monster => {
        const monsterElement = document.createElement('div');
        monsterElement.className = 'monster-item';
        monsterElement.innerHTML = `
            <div class="monster-header" onclick="toggleMonsterDetails('${monster.index}')">
                ${monster.name}
            </div>
            <div class="monster-details" id="details-${monster.index}"></div>
        `;
        monsterList.appendChild(monsterElement);
    });
    
    
    prevButton.disabled = true;
    nextButton.disabled = true;
}


prevButton.addEventListener('click', () => {
    currentOffset--;
    displayMonsters();
});

nextButton.addEventListener('click', () => {
    currentOffset++;
    displayMonsters();
});

searchButton.addEventListener('click', searchMonsters);
monsterInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMonsters();
});


document.addEventListener('DOMContentLoaded', fetchMonsters);