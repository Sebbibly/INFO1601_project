let currentOffset = 0;
  const spellsPerPage = 15;
  let allSpells = [];
  
  const spellList = document.getElementById('spellList');
  const loadingElement = document.getElementById('loading');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const searchInput = document.getElementById('spellInput');
  const searchButton = document.getElementById('searchButton');
  


async function fetchAllSpells() {
  loadingElement.classList.remove('hidden');
  spellList.innerHTML = '';

  try {const response = await fetch('https://www.dnd5eapi.co/api/spells');
    const data = await response.json();
    allSpells = data.results;
    displaySpells();
  } catch (error) {
    spellList.innerHTML = `<p class="text-red-400">Error loading spells: ${error.message}</p>`;
  } finally {
    loadingElement.classList.add('hidden');
  } 
}


function displaySpells() {
  spellList.innerHTML = '';
  const startIdx = currentOffset * spellsPerPage;
  const endIdx = startIdx + spellsPerPage;
  const spellsToShow = allSpells.slice(startIdx, endIdx);
  
  if (spellsToShow.length === 0) {
    spellList.innerHTML = '<p>No spells found</p>';
    return;
  }
  spellsToShow.forEach(spell => {
    const spellElement = document.createElement('div');
    spellElement.className = 'spell-item';
    spellElement.innerHTML = `<div class="spell-header" onclick="toggleSpellDetails('${spell.index}')">
                              ${spell.name}
                              </div>
                              <div class="spell-details" id="details-${spell.index}"></div>`;
    spellList.appendChild(spellElement);
  });
  

  prevButton.disabled = currentOffset === 0;
  nextButton.disabled = endIdx >= allSpells.length;
}


async function toggleSpellDetails(spellIndex) {
  const detailsElement = document.getElementById(`details-${spellIndex}`);
  
  if (detailsElement.innerHTML) { 
    detailsElement.style.maxHeight = detailsElement.style.maxHeight ? null : `${detailsElement.scrollHeight}px`;
    return;
  }

  detailsElement.innerHTML = '<p>Loading details...</p>';
  detailsElement.style.maxHeight = `${detailsElement.scrollHeight}px`;

  try { const response = await fetch(`https://www.dnd5eapi.co/api/spells/${spellIndex}`);
        const spellData = await response.json();
  
    let detailsHTML = ''; 
    detailsHTML += `<p><strong>Level:</strong> ${spellData.level}</p>
                    <p><strong>School:</strong> ${spellData.school.name}</p>`;
    
    if (spellData.classes && spellData.classes.length > 0) {
      const classNames = spellData.classes.map(c => c.name).join(', ');
      detailsHTML += `<p><strong>Classes:</strong> ${classNames}</p>`;}
  
    if (spellData.subclasses && spellData.subclasses.length > 0) {
      const subclassNames = spellData.subclasses.map(s => s.name).join(', ');
      detailsHTML += `<p><strong>Subclasses:</strong> ${subclassNames}</p>`;
    }
    detailsHTML += `<p><strong>Casting Time:</strong> ${spellData.casting_time}</p>
                    <p><strong>Range:</strong> ${spellData.range}</p>
                    <p><strong>Components:</strong> ${spellData.components.join(', ')}`;

    if (spellData.material) detailsHTML += ` (${spellData.material})`;
    detailsHTML += `</p>
                    <p><strong>Duration:</strong> ${spellData.duration}</p>`;
    
    if (spellData.desc && spellData.desc.length > 0) {
      detailsHTML += `<p><strong>Description:</strong></p>`;
      spellData.desc.forEach(desc => {
        detailsHTML += `<p>${desc}</p>`;
      });
    }
    
    if (spellData.higher_level && spellData.higher_level.length > 0) {
      detailsHTML += `<p><strong>At Higher Levels:</strong></p>`;
      spellData.higher_level.forEach(hl => {
        detailsHTML += `<p>${hl}</p>`;
      }); }
    detailsElement.innerHTML = detailsHTML;
    detailsElement.style.maxHeight = `${detailsElement.scrollHeight}px`;
  } catch (error) {
    detailsElement.innerHTML = `<p class="text-red-400">Error loading spell details: ${error.message}</p>`;
  }
}

function searchSpells(currentOffset) {
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm === '') {
    fetchAllSpells();
    return;
  }
  
  const filteredSpells = allSpells.filter(spell =>spell.name.toLowerCase().includes(searchTerm)
  );
  
  if (filteredSpells.length === 0) {
    spellList.innerHTML = '<p>No spells match your search</p>';
    prevButton.disabled = true;
    nextButton.disabled = true;
    return;
  }
  
  
  spellList.innerHTML = '';
  filteredSpells.forEach(spell => {
    const spellElement = document.createElement('div');
    spellElement.className = 'spell-item';
    spellElement.innerHTML = `
      <div class="spell-header" onclick="toggleSpellDetails('${spell.index}')">
        ${spell.name}
      </div>
      <div class="spell-details" id="details-${spell.index}"></div>
    `;
    spellList.appendChild(spellElement);
  });

 
  prevButton.disabled = true;
  nextButton.disabled = true;
}


prevButton.addEventListener('click', () => {
   currentOffset--;
  displaySpells();
});

nextButton.addEventListener('click', () => {
  currentOffset++;
  displaySpells();
});

searchButton.addEventListener('click', searchSpells);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchSpells();
});

document.addEventListener('DOMContentLoaded', fetchAllSpells);

