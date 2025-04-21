let currentOffset = 0;
const racesPerPage = 9;
let allRaces = [];

const raceList = document.getElementById('raceList');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const raceInput = document.getElementById('raceInput');
const searchButton = document.getElementById('searchButton');

const loadingElement = document.getElementById('loading');

async function fetchRaces() {
    loadingElement.classList.remove('hidden');
    raceList.innerHTML = '';
    
    try {
        const response = await fetch('https://www.dnd5eapi.co/api/2014/races');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        allRaces = data.results;
        displayRaces();
    } catch (error) {
        console.error('Error fetching races:', error);
        raceList.innerHTML = `<p class="error">Error loading races: ${error.message}</p>`;
    } finally {
        loadingElement.classList.add('hidden');
    }
}

function displayRaces() {
    raceList.innerHTML = '';
    const startIdx = currentOffset * racesPerPage;
    const endIdx = startIdx + racesPerPage;
    const racesToShow = allRaces.slice(startIdx, endIdx);
    
    if (racesToShow.length === 0) {
        raceList.innerHTML = '<p>No races found</p>';
        return;
    }
    
    racesToShow.forEach(race=> {
        const raceElement = document.createElement('div');
        raceElement.className = 'race-item';
        raceElement.innerHTML = `
            <div class="race-header" onclick="toggleRaceDetails('${race.index}')">
                ${race.name}
            </div>
            <div class="race-details" id="details-${race.index}"></div>
        `;
        raceList.appendChild(raceElement);
    });
    
   
    prevButton.disabled = currentOffset === 0;
    nextButton.disabled = endIdx >= allRaces.length;
}

async function toggleRaceDetails(raceIndex) {
    const detailsElement = document.getElementById(`details-${raceIndex}`);
    
    if (detailsElement.innerHTML && detailsElement.style.maxHeight !== '0px') {
        detailsElement.style.maxHeight = '0';
        return;
    }

    detailsElement.innerHTML = '<p>Loading details...</p>';
    detailsElement.style.maxHeight = '0';
    detailsElement.style.display = 'block';

    try {
        const response = await fetch(`https://www.dnd5eapi.co/api/2014/races/${raceIndex}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const raceData = await response.json();
        
        let detailsHTML = '';
        

        detailsHTML += `<p><strong>Size:</strong> ${raceData.size}</p>`;
        detailsHTML += `<p><strong>Speed:</strong> ${raceData.speed} ft.</p>`;
        
        if (raceData.languages && raceData.languages.length > 0) {
            detailsHTML += `<p><strong>Languages:</strong> `;
            detailsHTML += raceData.languages.map(lang => lang.name).join(', ');
            detailsHTML += `</p>`;
        }

        if (raceData.ability_bonuses && raceData.ability_bonuses.length > 0) {
            detailsHTML += `<p><strong>Ability Bonuses:</strong> `;
            detailsHTML += raceData.ability_bonuses.map(bonus => 
                `${bonus.ability_score.name}: +${bonus.bonus}`
            ).join(', ');
            detailsHTML += `</p>`;
        }

        if (raceData.traits && raceData.traits.length > 0) {
            detailsHTML += `<p><strong>Traits:</strong> `;
            detailsHTML += raceData.traits.map(trait => trait.name).join(', ');
            detailsHTML += `</p>`;
        }
        
        
        if (raceData.starting_proficiencies && raceData.starting_proficiencies.length > 0) {
            detailsHTML += `<p><strong>Starting Proficiencies:</strong> `;
            detailsHTML += raceData.starting_proficiencies.map(prof => prof.name).join(', ');
            detailsHTML += `</p>`;
        } else {
            detailsHTML += `<p><strong>Starting Proficiencies:</strong> None</p>`;
        }
        
    
        if (raceData.subraces && raceData.subraces.length > 0) {
            detailsHTML += `<p><strong>Subraces:</strong> `;
            detailsHTML += raceData.subraces.map(subrace => subrace.name).join(', ');
            detailsHTML += `</p>`;
        }
        
        detailsElement.innerHTML = detailsHTML;
        detailsElement.style.maxHeight = `${detailsElement.scrollHeight}px`;
    } catch (error) {
        console.error('Error fetching race details:', error);
        detailsElement.innerHTML = `<p class="error">Error loading race details: ${error.message}</p>`;
        detailsElement.style.maxHeight = `${detailsElement.scrollHeight}px`;
    }
}

function searchRaces() {
    const searchTerm = raceInput.value.toLowerCase().trim();
    if (searchTerm === '') {
        currentOffset = 0;
        fetchRaces();
        return;
    }
    
    const filteredRaces = allRaces.filter(race=> 
        race.name.toLowerCase().includes(searchTerm)
    );
    
    raceList.innerHTML = '';
    
    if (filteredRaces.length === 0) {
        raceList.innerHTML = '<p>No Races match your search</p>';
        prevButton.disabled = true;
        nextButton.disabled = true;
        return;
    }
    
    filteredRaces.forEach(race=> {
        const raceElement = document.createElement('div');
        raceElement.className = 'race-item';
        raceElement.innerHTML = `
            <div class="race-header" onclick="toggleRaceDetails('${race.index}')">
                ${race.name}
            </div>
            <div class="race-details" id="details-${race.index}"></div>
        `;
        raceList.appendChild(raceElement);
    });
    
    // Disable pagination during search
    prevButton.disabled = true;
    nextButton.disabled = true;
}




searchButton.addEventListener('click', searchRaces);
raceInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchRaces();
});


document.addEventListener('DOMContentLoaded', fetchRaces);