let currentOffset = 0;
const classesPerPage = 12;
let allClasses = [];

const classList = document.getElementById('classList');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const classInput = document.getElementById('classInput');
const searchButton = document.getElementById('searchButton');

const loadingElement = document.getElementById('loading');

async function fetchClasses() {
    loadingElement.classList.remove('hidden');
    classList.innerHTML = '';
    
    try {
        const response = await fetch('https://www.dnd5eapi.co/api/2014/classes');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        allClasses = data.results;
        displayClasses();
    } catch (error) {
        console.error('Error fetching classes:', error);
        classList.innerHTML = `<p class="error">Error loading classes: ${error.message}</p>`;
    } finally {
        loadingElement.classList.add('hidden');
    }
}

function displayClasses() {
    classList.innerHTML = '';
    const startIdx = currentOffset * classesPerPage;
    const endIdx = startIdx + classesPerPage;
    const classesToShow = allClasses.slice(startIdx, endIdx);
    
    if (classesToShow.length === 0) {
        classList.innerHTML = '<p>No classes found</p>';
        return;
    }
    
    classesToShow.forEach(clas=> {
        const classElement = document.createElement('div');
        classElement.className = 'class-item';
        classElement.innerHTML = `
            <div class="class-header" onclick="toggleClassDetails('${clas.index}')">
                ${clas.name}
            </div>
            <div class="class-details" id="details-${clas.index}"></div>
        `;
        classList.appendChild(classElement);
    });
    
    // Update pagination buttons
    prevButton.disabled = currentOffset === 0;
    nextButton.disabled = endIdx >= allClasses.length;
}

async function toggleClassDetails(classIndex) {
    const detailsElement = document.getElementById(`details-${classIndex}`);
    
    if (detailsElement.innerHTML) {
        detailsElement.style.maxHeight = detailsElement.style.maxHeight ? null : `${detailsElement.scrollHeight}px`;
        return;
    }

    detailsElement.innerHTML = '<p>Loading details...</p>';
    detailsElement.style.maxHeight = '0';
    detailsElement.style.display = 'block';

    try {
        const response = await fetch(`https://www.dnd5eapi.co/api/2014/classes/${classIndex}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const classData = await response.json();
        
        let detailsHTML = '';
        
     
        detailsHTML += `<p><strong>Hit Die:</strong> ${classData.hit_die}</p>`;

        if (classData.saving_throws && classData.saving_throws.length > 0) {
            detailsHTML += `<p><strong>Saving Throws:</strong> ${classData.saving_throws.map(st => st.name).join(', ')}</p>`;
        }
        
        
        if (classData.proficiencies && classData.proficiencies.length > 0) {

            detailsHTML += `<p><strong>Proficiencies:</strong> ${classData.proficiencies.map(p => p.name).join(', ')}</p>`;
        }
        
       
        detailsHTML += `<p><strong>Spellcasting:</strong> ${classData.spellcasting ? 'Yes' : 'No'}</p>`;

       
        
        detailsElement.innerHTML = detailsHTML;
        detailsElement.style.maxHeight = `${detailsElement.scrollHeight}px`;
    } catch (error) {
        console.error('Error fetching class details:', error);
        detailsElement.innerHTML = `<p class="error">Error loading class details: ${error.message}</p>`;
    }
}

function searchClasses() {
    const searchTerm = classInput.value.toLowerCase().trim();
    if (searchTerm === '') {
        currentOffset = 0;
        fetchClasses();
        return;
    }
    
    const filteredClasses = allClasses.filter(clas=> 
        clas.name.toLowerCase().includes(searchTerm)
    );
    
    classList.innerHTML = '';
    
    if (filteredClasses.length === 0) {
        classList.innerHTML = '<p>No classes match your search</p>';
        prevButton.disabled = true;
        nextButton.disabled = true;
        return;
    }
    
    filteredClasses.forEach(clas=> {
        const classElement = document.createElement('div');
        classElement.className = 'class-item';
        classElement.innerHTML = `
            <div class="class-header" onclick="toggleClassDetails('${clas.index}')">
                ${clas.name}
            </div>
            <div class="class-details" id="details-${clas.index}"></div>
        `;
        classList.appendChild(classElement);
    });
    
    // Disable pagination during search
    prevButton.disabled = true;
    nextButton.disabled = true;
}




searchButton.addEventListener('click', searchClasses);
classInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchClasses();
});


document.addEventListener('DOMContentLoaded', fetchClasses);