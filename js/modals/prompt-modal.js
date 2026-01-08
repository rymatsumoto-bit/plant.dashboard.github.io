import { loadHTML, capitalize } from '../utils.js';

/**
 * Opens a modal with flexible configuration
 * @param {Object} config - Modal configuration
 * @param {string} config.title - Modal title
 * @param {string} config.contentUrl - Path to content HTML file
 * @param {string} config.size - Modal size: 'small', 'medium', 'large' (default: 'medium')
 * @param {Array} config.buttons - Button configuration array
 * @param {Function} config.onSubmit - Optional submit handler
 * @param {Function} config.onClose - Optional close handler
 * @param {Object} config.data - Optional data to pass to form
 */
export async function openModal(config) {
  try {
    // Validate required config
    if (!config.title || !config.contentUrl) {
      throw new Error('Modal config must include title and contentUrl');
    }
    
    // Default configuration
    const modalConfig = {
      size: 'medium',
      buttons: [
        { label: 'SAVE', type: 'primary', action: 'submit' },
        { label: 'CANCEL', type: 'secondary', action: 'close' }
      ],
      onSubmit: null,
      onClose: null,
      data: null,
      ...config
    };
    
    // Load modal shell HTML
    const modalHTML = await loadHTML('components/modals/prompt-modal.html');
    
    // Create modal element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML.trim();
    const modal = tempDiv.firstElementChild;
    
    // Append to body FIRST
    document.body.appendChild(modal);

    // Query elements from modal
    const body = modal.querySelector('#modal-body');
    const title = modal.querySelector('#modal-title');
    const buttonContainer = modal.querySelector('#modal-buttons');

    if (!body || !title || !buttonContainer) {
      console.error('Modal elements not found');
      modal.remove();
      return;
    }

    // Load specific form content
    const formHTML = await loadHTML(modalConfig.contentUrl);
    body.innerHTML = formHTML;
    
    // Set title
    title.textContent = modalConfig.title;
    
    // Set modal size
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.add(`modal-${modalConfig.size}`);
    
    // Render buttons
    renderButtons(buttonContainer, modalConfig.buttons, modal, modalConfig);

    // Make modal visible
    modal.classList.add('show');

    // Setup close handlers
    setupCloseHandlers(modal, modalConfig.onClose);
    
    // If data provided, populate form
    if (modalConfig.data) {
      populateForm(modal, modalConfig.data);
    }
    
    // Return modal reference for external manipulation if needed
    return modal;
    
  } catch (error) {
    console.error('Error opening modal:', error);
    alert('Error opening modal. Please check the console for details.');
  }
}

/**
 * Render dynamic buttons in modal footer
 */
function renderButtons(container, buttons, modal, config) {
  container.innerHTML = buttons.map(btn => {
    const btnClass = getButtonClass(btn.type);
    return `<button type="button" class="btn ${btnClass}" data-action="${btn.action}">${btn.label}</button>`;
  }).join('');
  
  // Attach event listeners
  container.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      handleButtonAction(button.dataset.action, modal, config);
    });
  });
}

/**
 * Get CSS class for button type
 */
function getButtonClass(type) {
  const classMap = {
    'primary': 'btn-primary',
    'secondary': 'btn-secondary',
    'danger': 'btn-delete',
    'cancel': 'btn-cancel'
  };
  return classMap[type] || 'btn-secondary';
}

/**
 * Handle button actions
 */
function handleButtonAction(action, modal, config) {
  switch (action) {
    case 'submit':
      handleSubmit(modal, config);
      break;
    case 'close':
      closeModal(modal, config.onClose);
      break;
    case 'delete':
      handleDelete(modal, config);
      break;
    default:
      console.warn(`Unknown action: ${action}`);
  }
}

/**
 * Handle form submission
 */
function handleSubmit(modal, config) {
  const form = modal.querySelector('form');
  
  if (form) {
    // Trigger HTML5 validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Call custom submit handler if provided
    if (config.onSubmit) {
      config.onSubmit(data, modal);
    } else {
      console.log('Form data:', data);
      closeModal(modal, config.onClose);
    }
  } else {
    // No form found, just close
    closeModal(modal, config.onClose);
  }
}

/**
 * Handle delete action
 */
function handleDelete(modal, config) {
  if (confirm('Are you sure you want to delete this item?')) {
    // Call custom delete handler if provided
    if (config.onDelete) {
      config.onDelete(modal);
    }
    closeModal(modal, config.onClose);
  }
}

/**
 * Setup close handlers (backdrop click, escape key)
 */
function setupCloseHandlers(modal, onClose) {
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal, onClose);
    }
  });
  
  // Close on Escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(modal, onClose);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
  
  // Store handler reference for cleanup
  modal._escapeHandler = escapeHandler;
}

/**
 * Close modal with cleanup
 */
function closeModal(modal, onClose) {
  // Call custom close handler if provided
  if (onClose) {
    onClose(modal);
  }
  
  // Remove escape key handler
  if (modal._escapeHandler) {
    document.removeEventListener('keydown', modal._escapeHandler);
  }
  
  modal.classList.remove('show');
  
  // Wait for animation before removing
  setTimeout(() => {
    modal.remove();
  }, 300);
}

/**
 * Populate form with data (for edit modals)
 */
function populateForm(modal, data) {
  Object.keys(data).forEach(key => {
    const input = modal.querySelector(`[name="${key}"], #${key}`);
    if (input) {
      if (input.type === 'checkbox') {
        input.checked = data[key];
      } else if (input.type === 'radio') {
        const radio = modal.querySelector(`[name="${key}"][value="${data[key]}"]`);
        if (radio) radio.checked = true;
      } else {
        input.value = data[key];
      }
    }
  });
}

/**
 * Populate a dropdown with options
 * @param {string} selectId - ID of the select element
 * @param {Array} items - Array of data objects
 * @param {string} valueKey - Property name for option value
 * @param {string} labelKey - Property name for option label
 */
export function populateDropdown(selectId, items, valueKey, labelKey) {
    const select = document.getElementById(selectId);
    
    if (!select) {
        console.warn(`Select element with id '${selectId}' not found`);
        return;
    }
    
    // Clear existing options except the first (placeholder)
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Add new options
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[labelKey];
        select.appendChild(option);
    });
}




// Also make available globally for inline handlers if needed
if (typeof window !== 'undefined') {
    window.openModal = openModal;
}