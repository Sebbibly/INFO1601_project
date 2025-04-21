let result = document.querySelector('#result');
let next = document.querySelector('#next');
let prev = document.querySelector('#prev');


function showLoading() {
  result.innerHTML = "<h1 style='text-align: center'>Loading...</h1>";
  next.disabled = true;
  prev.disabled = true;
}

function showSpellDetails(spell) {
  let html = '';
  const details = document.querySelector('#details');

  fetch(`https://www.dnd5eapi.co/api/2014/spells/${spell}`)
    .then((response) => response.json())
    .then((spells) => {
      html += `<h2>${spells.name}</h2>`;
      html += `<p><strong>Class:</strong> ${spells.classes.join(' ,')}</p>`;
      html += `<p><strong>Subclass:</strong> ${spells.subclasses.join(' ,')}</p>`;
      html += `<p><strong>Level:</strong> ${spells.level}</p>`;
      html += `<p><strong>Range:</strong> ${spells.range}</p>`;
      html += `<p><strong>Duration:</strong> ${spells.duration}</p>`;
      html += `<p><strong>Description:</strong> ${spells.desc.join(' ')}</p>`;

      details.innerHTML = html;
    })
    .catch((error) => {
      console.error('Error fetching spell details:', error);
    });
}

async function getDetails(offset) {
  const result = document.querySelector('#result');
 
    const response = await fetch(`https://www.dnd5eapi.co/api/spells`);
    const spells = await response.json();
    let html = '';
    for (let i = offset; i < offset + 15 || i < spells.count; i++) {
      html += `<button type="button" class="collapsible">${spells.results[i].name}</button>
               <div class="content">
                 <p>showSpellDetails('${spells.results[i].index}</p>
               </div>`;
    }
    result.innerHTML = html;
  
}

async function spellLevel(level) {
  const leveled = document.querySelector('#leveled');

  const response = await fetch(`https://www.dnd5eapi.co/api/spells`);
  const spell= await response.json();
  let html = '';

  for (spell of spell.results) {
  if (spell.results[i].level === level) {
    push(spell.results[i]);
  }}
  for (let i = offset; i < offset + 15 || i < spells.count; i++) {
    html += `<button type="button" class="collapsible">${spells.results[i].name}</button>
             <div class="content">
               <p>showSpellDetails('${spells.results[i].index}</p>
             </div>`;
  }
  leveled.innerHTML = html;

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

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('collapsible')) {
    e.target.classList.toggle('active');
    const content = e.target.nextElementSibling;
    if (content.style.display === 'block') {
      content.style.display = 'none';
    } else {
      content.style.display = 'block';
    }
  }
});
getDetails(0); 
next.addEventListener('click', nextPage); 
prev.addEventListener('click', prevPage);