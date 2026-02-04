
let currentLightType = null;
let selectedOutdoorDirections = [];

export function initLightModal() {
  // Open modal buttons: could be bound elsewhere
  document.querySelectorAll('.open-light-modal').forEach(btn => {
    btn.addEventListener('click', () => openLightModal(btn.dataset.type));
  });

  // Close modal when clicking outside
  const modal = document.getElementById('light-modal');
  modal.addEventListener('click', e => {
    if (e.target.id === 'light-modal') closeLightModal();
  });

  // Form submission
  document.getElementById('light-form').addEventListener('submit', handleFormSubmit);
}

// Open the modal and show correct form
function openLightModal(type) {
  currentLightType = type;
  const modal = document.getElementById('light-modal');
  modal.classList.add('active');

  hideAllForms();
  const title = document.getElementById('modal-title');

  if (type === 'artificial') {
    title.textContent = 'Add Artificial Light';
    document.getElementById('artificial-form').style.display = 'block';
  } else if (type === 'window') {
    title.textContent = 'Add Window';
    document.getElementById('window-form').style.display = 'block';
  } else if (type === 'outdoor') {
    title.textContent = 'Add Outdoor Exposure';
    document.getElementById('outdoor-form').style.display = 'block';
  }
}

function hideAllForms() {
  document.getElementById('artificial-form').style.display = 'none';
  document.getElementById('window-form').style.display = 'none';
  document.getElementById('outdoor-form').style.display = 'none';
}

// Close modal and reset
export function closeLightModal() {
  document.getElementById('light-modal').classList.remove('active');
  document.getElementById('light-form').reset();
  selectedOutdoorDirections = [];
  document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
}

// Form submission handler
function handleFormSubmit(e) {
  e.preventDefault();
  if (currentLightType === 'artificial') alert('Artificial light added!');
  else if (currentLightType === 'window') alert('Window added!');
  else if (currentLightType === 'outdoor') {
    alert('Outdoor exposure added! Directions: ' + selectedOutdoorDirections.join(', '));
  }

  closeLightModal();
}

// Toggle functions
export function toggleTimeInput(type) {
  const select = document.getElementById(`light-${type}-type`);
  const input = document.getElementById(`light-${type}-input`);
  const location = document.getElementById(`light-${type}-location`);

  if (select.value === 'fixed') {
    input.style.display = 'block';
    location.style.display = 'none';
  } else {
    input.style.display = 'none';
    location.style.display = 'block';
  }
}

export function toggleDirection(button, direction) {
  button.classList.toggle('active');
  const index = selectedOutdoorDirections.indexOf(direction);
  if (index > -1) selectedOutdoorDirections.splice(index, 1);
  else selectedOutdoorDirections.push(direction);
}
