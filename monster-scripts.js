let currentOffset = 0;
  const spellsPerPage = 10;
  let allMonsters = [];
  
  const spellList = document.getElementById('MonsterList');
  const loadingElement = document.getElementById('loading');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const searchInput = document.getElementById('MonsterInput');
  const searchButton = document.getElementById('searchButton');
  
  async function fetchAllSpells() {
    loadingElement.classList.remove('hidden');
    spellList.innerHTML = '';
    
    try {
      const response = await fetch('https://www.dnd5eapi.co/api/monster');
      const data = await response.json();
      allmonster= data.results;
      displaySpells();
    } catch (error) {
      spellList.innerHTML = `<p class="text-red-400">Error loading spells: ${error.message}</p>`;
    } finally {
      loadingElement.classList.add('hidden');
    }
  }
