let result = document.querySelector('#result');
let next = document.querySelector('#next');
let prev = document.querySelector('#prev');
let offset = 0; // Initialize offset

function showLoading() {
  result.innerHTML = "<h1 style='text-align: center'>Loading...</h1>";
  next.disabled = true;
  prev.disabled = true;
}

function showSpellDetails(spell) {
  let html = '';
  const result = document.querySelector('#details'); // Ensure this ID exists in your HTML

;
  fetch(`https://www.dnd5eapi.co/api/2014/spells/${spell}`)
    .then((response) => response.json())
    .then((data) => {
      html += `<h2>${data.name}</h2>`;
      html += `<p><strong>Class:</strong> ${data.classes}</p>`;
      html += `<p><strong>Subclass:</strong> ${data.subclasses.join(' ,')}</p>`;
      html += `<p><strong>Damage-type:</strong> ${data.damage.damage_type}</p>`;
      html += `<p><strong>Range:</strong> ${data.range}</p>`;
      html += `<p><strong>Duration:</strong> ${data.duration}</p>`;
      html += `<p><strong>Description:</strong> ${data.desc.join(' ')}</p>`;

      result.innerHTML = html;
    })
    .catch((error) => {
      console.error('Error fetching spell details:', error);
    });
}

async function getDetails(offset) {
  const result = document.querySelector('#result');

  try {
    const response = await fetch(`https://www.dnd5eapi.co/api/spells`);
    const data = await response.json();
    let html = '';
    for (let i = offset; i < offset + 15 && i < data.results.length; i++) {
      html += `<button type="button" class="collapsible">${data.results[i].name}</button>
               <div class="content">
                 <p onclick="showSpellDetails('${data.results[i].index}')">Show Details</p>
               </div>`;
    }
    result.innerHTML = html;
  } catch (error) {
    console.error('Error fetching spells:', error);
    result.innerHTML = "<h1 style='text-align: center; color: red;'>Failed to load spells</h1>";
  }
}

function nextPage() {
  offset += 15;
  showLoading();
  getDetails(offset);
}

function prevPage() {
  if (offset > 0) {
    offset -= 15;
    showLoading();
    getDetails(offset);
  }
}