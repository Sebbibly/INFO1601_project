let currentOffset = 0;
  const monstersperPage = 10;
  let allMonsters = [];
  
  const monList= document.getElementById('MonsterList');
  const loadingElement = document.getElementById('loading');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const MonsterInput= document.getElementById('MonsterInput');
  const searchButton = document.getElementById('searchButton');
  
  async function fetchMonsters() {
    loadingElement.classList.remove('hidden');
    monList.innerHTML = '';
    
    try {
      const response = await fetch('https://www.dnd5eapi.co/api/monster');
      const data = await response.json();
      allMonster= data.results;
      displayMonsters();
    } catch (error) {
      monList.innerHTML = `<p class="text-red-400">Error loading monsters: ${error.message}</p>`;
    } finally {
      loadingElement.classList.add('hidden');
    }
  }



  function displayMonsters() {
    monList.innerHTML = '';
    const startIdx = currentOffset * monstersperPage;
    const endIdx = startIdx + monstersperPage;
    const monstersToShow = allMonsters.slice(startIdx, endIdx);
    
    
    if (monstersToShow.length === 0) {
      monList.innerHTML = '<p>No monsters found</p>';
      return;
    }
    monstersToShow.forEach(monster => {
      const monElement = document.createElement('div');
      monElement.className = 'monster-item';
      monElement.innerHTML = `<div class="monster-header" onclick="togglemonsterDetails('${monster.index}')">
                                ${spell.name}
                                </div>
                                <div class="monster-details" id="details-${monster.index}"></div>`;
      monList.appendChild(monsterElement);
    });
    
  
    prevButton.disabled = currentOffset === 0;
    nextButton.disabled = endIdx >= allMonsters.length;
  }
  
  
  async function toggleMonDetails(Index) {
    const detailsElement = document.getElementById(`details-${Index}`);
    
    if (detailsElement.innerHTML) { 
      detailsElement.style.maxHeight = detailsElement.style.maxHeight ? null : `${detailsElement.scrollHeight}px`;
      return;
    }
  
    detailsElement.innerHTML = '<p>Loading details...</p>';
    detailsElement.style.maxHeight = `${detailsElement.scrollHeight}px`;
  
    try { const response = await fetch(`https://www.dnd5eapi.co/api/spells/${spellIndex}`);
          const MonData = await response.json();
    
      let detailsHTML = ''; 
      detailsHTML += `<p><strong>Level:</strong> ${MonData.level}</p>`;
      detailsHTML += `<p><strong>School:</strong> ${MonData.school.name}</p>`;
      
      if (MonData.classes && MonData.classes.length > 0) {
        const classNames = MonData.classes.map(c => c.name).join(', ');
        detailsHTML += `<p><strong>Classes:</strong> ${classNames}</p>`;}
    
      if (MonData.subclasses && MonData.subclasses.length > 0) {
        const subclassNames = MonData.subclasses.map(s => s.name).join(', ');
        detailsHTML += `<p><strong>Subclasses:</strong> ${subclassNames}</p>`;
      }
      detailsHTML += `<p><strong>Casting Time:</strong> ${MonData.casting_time}</p>`;
      detailsHTML += `<p><strong>Range:</strong> ${MonData.range}</p>`;
      detailsHTML += `<p><strong>Components:</strong> ${MonData.components.join(', ')}`;
      if (MonData.material) detailsHTML += ` (${MonData.material})`;
      detailsHTML += `</p>`;
      detailsHTML += `<p><strong>Duration:</strong> ${MonData.duration}</p>`;
      
      if (MonData.desc && MonData.desc.length > 0) {
        detailsHTML += `<p><strong>Description:</strong></p>`;
        MonData.desc.forEach(desc => {
          detailsHTML += `<p>${desc}</p>`;
        });
      }
      
      if (MonData.higher_level && MonData.higher_level.length > 0) {
        detailsHTML += `<p><strong>At Higher Levels:</strong></p>`;
        MonData.higher_level.forEach(hl => {
          detailsHTML += `<p>${hl}</p>`;
        }); }
      detailsElement.innerHTML = detailsHTML;
      detailsElement.style.maxHeight = `${detailsElement.scrollHeight}px`;
    } catch (error) {
      detailsElement.innerHTML = `<p class="text-red-400">Error loading monsters details: ${error.message}</p>`;
    }
  }
  
  function searchMonsters() {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm === '') {
      fetchMonsters();
      return;
    }
    
    const filteredMonsters = allMonsters.filter(monster =>monster.name.toLowerCase().includes(searchTerm)
    );
    
    if (filteredMonsters.length === 0) {
      monList.innerHTML = '<p>No monsters match your search</p>';
      prevButton.disabled = true;
      nextButton.disabled = true;
      return;
    }
    
    
    monList.innerHTML = '';
    filteredMonsters.forEach(monster => {
      const monElement = document.createElement('div');
      monElement.className = 'monster-item';
      monElement.innerHTML = `
        <div class="monster-header" onclick="toggleMonsterDetails('${monster.index}')">
          ${monster.name}
        </div>
        <div class="monster-details" id="details-${monster.index}"></div>`;
      monList.appendChild(monElement);
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
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMonsters();
  });
  
  document.addEventListener('DOMContentLoaded', fetchMonsters);
  