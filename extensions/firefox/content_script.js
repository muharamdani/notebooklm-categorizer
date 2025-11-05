'use strict';

const CATEGORIES_KEY = 'notebooklm_user_categories';
const ACTIVE_FILTER_KEY = 'notebooklm_active_filter';
let CATEGORIES = {};

/**
 * Main function to initialize the extension
 */
async function init() {
    await loadCategories();
    
    // Wait for the main projects container to appear
    document.arrive(
        '.all-projects-container',
        { existing: true, onceOnly: false }, (element) => {
            createFilterUI(element);
        }
    );
}

/**
 * Loads categories from storage,
 * if not present, sets and saves defaults.
 */
async function loadCategories() {
    let result = await browser.storage.local.get(CATEGORIES_KEY);
    if (Object.keys(result).length === 0 || Object.keys(result[CATEGORIES_KEY]).length === 0) {
        // Set default categories for the first time
        const defaultCategories = {
            'All': [],
            'Tutorial': ['How to', 'Course', 'Lecture', 'Tutorial'],
            'Finance': ['Investing', 'Gold', 'Stocks', 'Bonds', 'Funds'],
            'Other': [],
        };
        await browser.storage.local.set({ [CATEGORIES_KEY]: defaultCategories });
        CATEGORIES = defaultCategories;
    } else {
        CATEGORIES = result[CATEGORIES_KEY];
    }
}

/**
 * Determines the category of a project based on its title.
 * @param {HTMLElement} projectElement
 * @returns {string}
 */
function getProjectCategory(projectElement) {
    const titleElement = projectElement.querySelector('.project-button-title, .project-table-title');
    if (!titleElement) {
        console.log('No title found in project element:', projectElement);
        return 'Other';
    }

    const title = titleElement.textContent.toLowerCase().trim();

    for (const categoryName in CATEGORIES) {
        // Skip special categories 'All' and 'Other' in the first pass
        if (categoryName === 'All' || categoryName === 'Other') continue;

        const keywords = CATEGORIES[categoryName] || [];
        for (const keyword of keywords) {
            if (typeof keyword === 'string' && keyword.trim() && title.includes(keyword.trim().toLowerCase())) {
                return categoryName;
            }
        }
    }

    // Check if 'Other' has explicit keywords
    if (CATEGORIES['Other'] && CATEGORIES['Other'].length > 0) {
        const otherKeywords = CATEGORIES['Other'];
        for (const keyword of otherKeywords) {
            if (typeof keyword === 'string' && keyword.trim() && title.includes(keyword.trim().toLowerCase())) {
                return 'Other';
            }
        }
    }

    // If no match found anywhere, return 'Other' as the catch-all
    return 'Other';
}

/**
 * Count projects for each category and update button text
 */
function updateButtonCounts() {
    const projectButtons = document.querySelectorAll('project-button, tr.mat-mdc-row');
    const categoryCounts = {};

    // Initialize counts
    Object.keys(CATEGORIES).forEach(cat => {
        categoryCounts[cat] = 0;
    });

    // Count total projects for 'All'
    categoryCounts['All'] = projectButtons.length;

    // Count projects per category
    projectButtons.forEach(proj => {
        const category = getProjectCategory(proj);
        if (categoryCounts[category] !== undefined) {
            categoryCounts[category]++;
        }
    });

    // Update button text with counts
    document.querySelectorAll('.category-filter-button').forEach(btn => {
        const categoryName = btn.getAttribute('data-category');
        if (categoryName && categoryCounts[categoryName] !== undefined) {
            btn.textContent = `${categoryName} (${categoryCounts[categoryName]})`;
        }
    });

    console.log('Updated button counts:', categoryCounts);
}

/**
 * Filters the project list on the page based on the selected category.
 * @param {string} selectedCategory
 */
async function filterProjects(selectedCategory) {
    console.log(`Filtering by: ${selectedCategory}`);
    const projectButtons = document.querySelectorAll('project-button, tr.mat-mdc-row');

    projectButtons.forEach(proj => {
        const projectCategory = getProjectCategory(proj);
        if (selectedCategory === 'All' || projectCategory === selectedCategory) {
            proj.setAttribute('data-filtered', 'visible');
        } else {
            proj.setAttribute('data-filtered', 'hidden');
        }
    });

    // Update active button style
    document.querySelectorAll('.category-filter-button').forEach(btn => {
        const btnCategory = btn.getAttribute('data-category');
        if (btnCategory === selectedCategory) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Save the active filter state for persistence across navigation
    await browser.storage.local.set({ [ACTIVE_FILTER_KEY]: selectedCategory });
    console.log(`Saved active filter: ${selectedCategory}`);
}

/**
 * Creates and injects the filter button UI into the page.
 * @param {HTMLElement} targetContainer
 */
async function createFilterUI(targetContainer) {
    // Remove existing UI to prevent duplicates on SPA navigation
    const oldContainer = document.querySelector('.category-filter-container');
    if (oldContainer) {
        oldContainer.remove();
    }

    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filter-container';

    // Create buttons for all categories including 'All'
    Object.keys(CATEGORIES).forEach(categoryName => {
        const button = document.createElement('button');
        button.className = 'category-filter-button';
        button.setAttribute('data-category', categoryName);
        button.textContent = categoryName;
        button.addEventListener('click', () => filterProjects(categoryName));
        filterContainer.appendChild(button);
    });

    const managerButton = createManagerButton();
    filterContainer.appendChild(managerButton);

    // Find the featured projects container and insert before it
    const featuredProjectsContainer = targetContainer.querySelector('.featured-projects-container');
    if (featuredProjectsContainer) {
        targetContainer.insertBefore(filterContainer, featuredProjectsContainer);
    } else {
        // Fallback: insert at the beginning of the all-projects container
        targetContainer.insertBefore(filterContainer, targetContainer.firstChild);
    }

    // Update button counts
    updateButtonCounts();

    // Apply the previously saved filter, or 'All' if none
    const result = await browser.storage.local.get(ACTIVE_FILTER_KEY);
    const lastFilter = result[ACTIVE_FILTER_KEY] || 'All';
    console.log(`Applying initial/restored filter: ${lastFilter}`);
    filterProjects(lastFilter);
}

/**
 * Creates the button to open the category manager modal.
 * @returns {HTMLButtonElement}
 */
function createManagerButton() {
    const button = document.createElement('button');
    button.id = 'open-category-manager-btn';
    button.title = 'Manage Categories';
    // SVG for Gear Icon
    button.innerHTML = `<svg enable-background="new 0 0 32 32" id="Editable-line" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="16" cy="16" fill="none" id="XMLID_224_" r="4" stroke="#D3D3D3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></circle><path d="M27.758,10.366l-1-1.732c-0.552-0.957-1.775-1.284-2.732-0.732L23.5,8.206C21.5,9.36,19,7.917,19,5.608V5c0-1.105-0.895-2-2-2h-2  c-1.105,0-2,0.895-2,2v0.608c0,2.309-2.5,3.753-4.5,2.598L7.974,7.902C7.017,7.35,5.794,7.677,5.242,8.634l-1,1.732  c-0.552,0.957-0.225,2.18,0.732,2.732L5.5,13.402c2,1.155,2,4.041,0,5.196l-0.526,0.304c-0.957,0.552-1.284,1.775-0.732,2.732  l1,1.732c0.552,0.957,1.775,1.284,2.732,0.732L8.5,23.794c2-1.155,4.5,0.289,4.5,2.598V27c0,1.105,0.895,2,2,2h2  c1.105,0,2-0.895,2-2v-0.608c0-2.309,2.5-3.753,4.5-2.598l0.526,0.304c0.957,0.552,2.18,0.225,2.732-0.732l1-1.732  c0.552-0.957,0.225-2.18-0.732-2.732L26.5,18.598c-2-1.155-2-4.041,0-5.196l0.526-0.304C27.983,12.546,28.311,11.323,27.758,10.366z" fill="none" id="XMLID_242_" stroke="#D3D3D3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></path></svg>`;
    button.addEventListener('click', openCategoryManager);
    return button;
}

/**
 * Creates and displays the category management modal.
 */
function openCategoryManager() {
    if (document.getElementById('category-manager-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'category-manager-overlay';
    overlay.id = 'category-manager-overlay';

    const modal = document.createElement('div');
    modal.className = 'category-manager-modal';

    modal.innerHTML = `
        <h2>Manage Categories</h2>
        <div id="category-list-container"></div>
        <div class="modal-actions">
            <button id="add-new-category-btn">Add New Category</button>
            <div>
                <button id="cancel-categories-btn">Cancel</button>
                <button id="save-categories-btn">Save and Close</button>
            </div>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const listContainer = modal.querySelector('#category-list-container');
    
    // Add categories excluding 'All' since it's a special category
    for (const categoryName in CATEGORIES) {
        if (categoryName !== 'All') {
            const keywords = CATEGORIES[categoryName].join(', ');
            const entry = createCategoryEntry(categoryName, keywords);
            listContainer.appendChild(entry);
        }
    }

    modal.querySelector('#add-new-category-btn').addEventListener('click', () => {
        const newEntry = createCategoryEntry('', '');
        listContainer.appendChild(newEntry);
        newEntry.querySelector('.category-name-input').focus();
    });

    modal.querySelector('#save-categories-btn').addEventListener('click', saveAndCloseManager);
    modal.querySelector('#cancel-categories-btn').addEventListener('click', closeCategoryManager);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeCategoryManager();
    });
}

/**
 * Creates a new category entry element for the modal.
 * @param {string} name
 * @param {string} keywords
 * @returns {HTMLDivElement}
 */
function createCategoryEntry(name, keywords) {
    const entry = document.createElement('div');
    entry.className = 'category-entry';
    entry.innerHTML = `
        <div>
            <label>
                Category Name
                <input name="category-name-input" type="text" class="category-name-input" placeholder="e.g., Work" value="${name}">
            </label>
        </div>
        <div>
            <label>
                Keywords (comma-separated)
                <input name="category-keywords-input" type="text" class="category-keywords-input" placeholder="e.g., Project X, Meeting" value="${keywords}">
            </label>
        </div>
        <button class="delete-category-btn" title="Delete Category">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="4" y1="4" x2="12" y2="12" stroke="#888" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="4" x2="4" y2="12" stroke="#888" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
    `;
    entry.querySelector('.delete-category-btn').addEventListener('click', () => {
        entry.remove();
    });
    return entry;
}

/**
 * Closes and removes the category manager modal from the DOM.
 */
function closeCategoryManager() {
    const overlay = document.getElementById('category-manager-overlay');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * Saves categories from the modal to storage and rebuilds the UI.
 */
async function saveAndCloseManager() {
    const newCategories = {
        'All': [] // Always include 'All' category
    };
    
    const entries = document.querySelectorAll('.category-entry');

    entries.forEach(entry => {
        const nameInput = entry.querySelector('.category-name-input');
        const keywordsInput = entry.querySelector('.category-keywords-input');

        const name = nameInput.value.trim();
        if (name) {
            const keywords = keywordsInput.value.split(',').map(k => k.trim()).filter(Boolean);
            newCategories[name] = keywords;
        }
    });

    // Always include 'Other' category if it doesn't exist
    if (!newCategories['Other']) {
        newCategories['Other'] = [];
    }

    await browser.storage.local.set({ [CATEGORIES_KEY]: newCategories });

    CATEGORIES = newCategories;

    const projectContainer = document.querySelector('.all-projects-container');
    if (projectContainer) {
        await createFilterUI(projectContainer);
    }

    closeCategoryManager();
}

init();