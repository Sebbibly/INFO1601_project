let currentOffset = 0;
const equiptsPerPage = 15;
let allequipts = [];


const equiptList = document.getElementById('equiptList');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const equiptInput = document.getElementById('equiptInput');
const searchButton = document.getElementById('searchButton');
const loadingElement = document.getElementById('loading'); 


async function fetchEquipts() {
    if (!loadingElement || !equiptList) return;
    
    loadingElement.classList.remove('hidden');
    equiptList.innerHTML = '';
    
    try {
        const response = await fetch('https://www.dnd5eapi.co/api/equipment');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        allequipts = data.results;
        displayequipts();
    } catch (error) {
        console.error('Error fetching equipment:', error);
        if (equiptList) equiptList.innerHTML = `<p class="error">Error loading equipment: ${error.message}</p>`;
    } finally {
        loadingElement.classList.add('hidden');
    }
}

function displayequipts() {
    if (!equiptList || !prevButton || !nextButton) return;
    
    equiptList.innerHTML = '';
    const startIdx = currentOffset * equiptsPerPage;
    const endIdx = startIdx + equiptsPerPage;
    const equiptsToShow = allequipts.slice(startIdx, endIdx);
    
    if (equiptsToShow.length === 0) {
        equiptList.innerHTML = '<p>No equipment found</p>';
        return;
    }
    
    equiptsToShow.forEach(equipt => {
        const equiptElement = document.createElement('div');
        equiptElement.className = 'equipt-item';
        equiptElement.innerHTML = `
            <div class="equipt-header" onclick="toggleequiptDetails('${equipt.index}')">
                ${equipt.name}
            </div>
            <div class="equipt-details" id="details-${equipt.index}"></div>
        `;
        equiptList.appendChild(equiptElement);
    });
    
    if (prevButton) prevButton.disabled = currentOffset === 0;
    if (nextButton) nextButton.disabled = endIdx >= allequipts.length;
}

async function toggleequiptDetails(equiptIndex) {
    const detailsElement = document.getElementById(`details-${equiptIndex}`);
    if (!detailsElement) return;
    
    if (detailsElement.innerHTML && detailsElement.style.maxHeight !== '0px') {
        detailsElement.style.maxHeight = '0';
        return;
    }

    detailsElement.innerHTML = '<p>Loading details...</p>';
    detailsElement.style.maxHeight = '0';
    detailsElement.style.display = 'block';

    try {
        const response = await fetch(`https://www.dnd5eapi.co/api/equipment/${equiptIndex}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const equiptData = await response.json();
        
        let detailsHTML = '';
        
        
        detailsHTML += `<p><strong>Category:</strong> ${equiptData.equipment_category?.name || 'N/A'}</p>`;
        
        if (equiptData.cost) {
            detailsHTML += `<p><strong>Cost:</strong> ${equiptData.cost.quantity || '0'} ${equiptData.cost.unit || 'gp'}</p>`;
        }
        
        if (equiptData.weight) {
            detailsHTML += `<p><strong>Weight:</strong> ${equiptData.weight} lbs</p>`;
        }
        
        if (equiptData.armor_class) {
            detailsHTML += `<p><strong>Armor Class:</strong> ${equiptData.armor_class.base}`;
            if (equiptData.armor_class.dex_bonus) detailsHTML += ` + Dex modifier`;
            if (equiptData.armor_class.max_bonus) detailsHTML += ` (max ${equiptData.armor_class.max_bonus})`;
            detailsHTML += `</p>`;
        }
        
        if (equiptData.weapon_range) {
            detailsHTML += `<p><strong>Range:</strong> ${equiptData.weapon_range === 'Melee' ? 'Melee' : `${equiptData.range?.normal || 'N/A'} ft.`}</p>`;
        }
        
        if (equiptData.damage) {
            detailsHTML += `<p><strong>Damage:</strong> ${equiptData.damage.damage_dice} ${equiptData.damage.damage_type?.name || ''}</p>`;
        }
        
        if (equiptData.desc?.length > 0) {
            detailsHTML += `<p><strong>Description:</strong></p>`;
            equiptData.desc.forEach(desc => {
                detailsHTML += `<p>${desc}</p>`;
            });
        }

        detailsElement.innerHTML = detailsHTML;
        detailsElement.style.maxHeight = `${detailsElement.scrollHeight}px`;
    } catch (error) {
        console.error('Error fetching equipment details:', error);
        detailsElement.innerHTML = `<p class="error">Error loading equipment details: ${error.message}</p>`;
        detailsElement.style.maxHeight = `${detailsElement.scrollHeight}px`;
    }
}

function searchEquipts() {
    const searchTerm = equiptInput.value.toLowerCase().trim();
    if (searchTerm === '') {
        currentOffset = 0;
        fetchEquipts();
        return;
    }
    
    const filteredequipts = allequipts.filter(equipt => 
        equipt.name.toLowerCase().includes(searchTerm)
    );
    
    equiptList.innerHTML = '';
    
    if (filteredequipts.length === 0) {
        equiptList.innerHTML = '<p>No equipment matches your search</p>';
        prevButton.disabled = true;
        nextButton.disabled = true;
        return;
    }
    
    filteredequipts.forEach(equipt => {
        const equiptElement = document.createElement('div');
        equiptElement.className = 'equipt-item';
        equiptElement.innerHTML = `
            <div class="equipt-header" onclick="toggleequiptDetails('${equipt.index}')">
                ${equipt.name}
            </div>
            <div class="equipt-details" id="details-${equipt.index}"></div>
        `;
        equiptList.appendChild(equiptElement);
    });
    
    prevButton.disabled = true;
    nextButton.disabled = true;
}


prevButton.addEventListener('click', () => {
    currentOffset--;
    displayequipts();
});

nextButton.addEventListener('click', () => {
    currentOffset++;
    displayequipts();
});

searchButton.addEventListener('click', searchEquipts);
equiptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchEquipts();
});


document.addEventListener('DOMContentLoaded', fetchEquipts);