import { loadHTML, capitalize } from '../utils.js';

/**
 * Opens the prompt-modal and fills in the content (type)
 */
export async function openPromptModal(type) {
  try {
    // Load modal shell HTML
    const modalHTML = await loadHTML('components/modals/prompt-modal.html');
    
    // Create modal element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML.trim();
    const modal = tempDiv.firstElementChild; // This is the #prompt-modal div
    
    // Append to body FIRST
    document.body.appendChild(modal);

    // NOW query elements (query from modal, not document)
    const body = modal.querySelector('#modal-body');
    const title = modal.querySelector('#modal-title');

    if (!body) {
      console.error('Modal body not found');
      modal.remove();
      return;
    }
    
    if (!title) {
      console.error('Modal title not found');
      modal.remove();
      return;
    }

    // Load specific form content
    const formHTML = await loadHTML(`components/modals/${type}.html`);
    body.innerHTML = formHTML;
    
    // Set title
    const formattedType = type.replace(/-/g, ' ');
    title.textContent = `Add ${capitalize(formattedType)}`;

    // Make modal visible (add 'show' class if needed for CSS)
    modal.classList.add('show');

    // Setup close handlers - use the closeLightModal function you already have
    // Or define it here
    window.closeLightModal = () => closeModal(modal);
    
    // Close on backdrop click (clicking outside modal-content)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
    
    // Close on Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal(modal);
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    // Initialize form logic
    initFormLogic(type, modal);
    
  } catch (error) {
    console.error('Error opening modal:', error);
    alert('Error opening modal. Please check the console for details.');
  }
}

/**
 * Close modal
 */
function closeModal(modal) {
  modal.classList.remove('show');
  // Wait for animation before removing
  setTimeout(() => {
    modal.remove();
  }, 300);
}

/**
 * Initialize form-specific logic
 */
function initFormLogic(type, modal) {
  console.log(`Initializing form logic for: ${type}`);
  
  const form = modal.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(type, form, modal);
    });
  }
  
  // If there's a submit button outside the form, handle it
  const submitBtn = modal.querySelector('.btn-primary');
  if (submitBtn && !form) {
    submitBtn.addEventListener('click', () => {
      // Collect form data from inputs in modal-body
      const inputs = modal.querySelectorAll('#modal-body input, #modal-body select, #modal-body textarea');
      const data = {};
      inputs.forEach(input => {
        if (input.name) {
          data[input.name] = input.value;
        }
      });
      console.log('Collected data:', data);
      handleFormSubmit(type, data, modal);
    });
  }
}

/**
 * Handle form submission
 */
function handleFormSubmit(type, formOrData, modal) {
  console.log(`Submitting ${type} form`);
  
  let data;
  if (formOrData instanceof HTMLFormElement) {
    // It's a form
    const formData = new FormData(formOrData);
    data = Object.fromEntries(formData);
  } else {
    // It's already data object
    data = formOrData;
  }
  
  console.log('Form data:', data);
  
  // TODO: Save to database
  // TODO: Refresh view
  
  // Close modal
  closeModal(modal);
  
  alert('Data saved! (TODO: Actually save to database)');
}

// Make functions globally available
window.openPromptModal = openPromptModal;
window.closeLightModal = null; // Will be set when modal opens