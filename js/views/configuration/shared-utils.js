// ============================================
// SHARED-UTILS.JS - Shared Configuration Utilities
// ============================================

/**
 * Show loading state in a list element
 */
export function showLoadingState(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <li class="loading-inline">
                <div class="loading-spinner"></div>
                <span>Loading...</span>
            </li>
        `;
    }
}

/**
 * Show empty state in a list element
 */
export function showEmptyState(elementId, entityType, createFunctionCall) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const entityNames = {
        'habitat': 'habitats',
        'address': 'addresses'
    };
    
    const entityName = entityNames[entityType] || entityType;
    const capitalizedEntity = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    
    element.innerHTML = `
        <li class="empty-state">
            No ${entityName} configured yet.<br>
            <button class="btn btn-small btn-primary" 
                    style="margin-top: var(--spacing-md);" 
                    onclick="${createFunctionCall}">
                + CREATE ${capitalizedEntity.toUpperCase()}
            </button>
        </li>
    `;
}

/**
 * Show error state in a list element
 */
export function showErrorState(elementId, error) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <li class="error-container" style="padding: var(--spacing-lg);">
                <div class="error-icon">⚠️</div>
                <div class="error-message">
                    Error loading data.<br>
                    ${error.message || 'Please try again.'}
                </div>
            </li>
        `;
    }
}

/**
 * Debounce function for search/filter inputs
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate form field
 */
export function validateField(fieldId, validationRules) {
    const field = document.getElementById(fieldId);
    if (!field) return false;
    
    const value = field.value.trim();
    
    // Required check
    if (validationRules.required && !value) {
        return { valid: false, message: 'This field is required' };
    }
    
    // Min length check
    if (validationRules.minLength && value.length < validationRules.minLength) {
        return { 
            valid: false, 
            message: `Must be at least ${validationRules.minLength} characters` 
        };
    }
    
    // Max length check
    if (validationRules.maxLength && value.length > validationRules.maxLength) {
        return { 
            valid: false, 
            message: `Must be no more than ${validationRules.maxLength} characters` 
        };
    }
    
    // Pattern check (regex)
    if (validationRules.pattern && !validationRules.pattern.test(value)) {
        return { 
            valid: false, 
            message: validationRules.patternMessage || 'Invalid format' 
        };
    }
    
    return { valid: true };
}

/**
 * Show validation error on field
 */
export function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Add error class
    field.classList.add('field-error');
    
    // Create or update error message
    let errorMsg = field.parentElement.querySelector('.field-error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'field-error-message';
        field.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
}

/**
 * Clear validation error from field
 */
export function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.remove('field-error');
    
    const errorMsg = field.parentElement.querySelector('.field-error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

/**
 * Format date for display
 */
export function formatDisplayDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

/**
 * Confirm action with user
 */
export function confirmAction(message, onConfirm, onCancel) {
    if (confirm(message)) {
        if (onConfirm) onConfirm();
    } else {
        if (onCancel) onCancel();
    }
}