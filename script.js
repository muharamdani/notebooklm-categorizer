// ==UserScript==
// @name         NotebookLM Project Categorizer
// @namespace    https://github.com/muharamdani
// @version      1.2.0
// @description  Adds category filter buttons to the NotebookLM project list based on project titles. Handles SPA navigation. 'Other' category auto-catches unmatched projects.
// @author       muharamdani
// @match        https://notebooklm.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.co
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration: Define your categories and keywords
    // Add more categories and keywords as needed. Keywords are case-insensitive.
    // The key is the Category Name that will appear on the button.
    // The value is an array of keywords to look for in the project titles.
    //
    // Special categories:
    // - 'All': Shows all projects (no keywords needed)
    // - 'Other': Catches all projects that don't match any other category
    //            Leave empty [] to auto-catch, or add explicit keywords if needed
    const categories = {
        'All': [],
        'Tutorial': ['How to', 'Course', 'Lecture', 'Tutorial'],
        'Finance': ['Investing', 'Gold', 'Stocks', 'Bonds', 'Funds'],
        'Other': [], // Will automatically include unmatched projects
        // Add more categories like:
        // 'Work': ['Project X', 'Meeting Notes'],
        // 'Personal': ['Trip Planning', 'Recipes'],
    };

    // Persistent State Key
    const ACTIVE_FILTER_KEY = 'notebooklm_active_filter';

    // Styling for the buttons
    GM_addStyle(`
        .category-filter-container {
            padding: 10px 15px;
            margin-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            flex-wrap: wrap;
            gap: 10px; /* Spacing between buttons */
        }
        .category-filter-button {
            padding: 8px 15px;
            border: 1px solid #ccc;
            border-radius: 16px; /* Rounded corners */
            background-color: #f8f8f8;
            color: #333;
            cursor: pointer;
            font-size: 0.9em;
            transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .category-filter-button:hover {
            background-color: #eee;
            border-color: #bbb;
        }
        .category-filter-button.active {
            background-color: #4285f4; /* Google Blue */
            color: white;
            border-color: #4285f4;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        /* Hide projects using display:none */
        project-button[data-filtered="hidden"],
        tr.mat-mdc-row[data-filtered="hidden"] {
            display: none !important; /* Use !important to override potential existing styles */
        }
    `);

    // Determine the category of a project
    function getProjectCategory(projectElement) {
        const titleElement = projectElement.querySelector('.project-button-title, .project-table-title');
        if (!titleElement) {
            GM_log('No title found in project element:', projectElement);
            return 'Other';
        }

        const title = titleElement.textContent.toLowerCase().trim();

        for (const categoryName in categories) {
            // Skip special categories 'All' and 'Other' in the first pass
            if (categoryName === 'All' || categoryName === 'Other') continue;

            const keywords = categories[categoryName];
            for (const keyword of keywords) {
                if (title.includes(keyword.toLowerCase())) {
                    return categoryName; // Return the first category that matches
                }
            }
        }

        // Check if 'Other' has explicit keywords
        if (categories['Other'] && categories['Other'].length > 0) {
            const otherKeywords = categories['Other'];
            for (const keyword of otherKeywords) {
                if (title.includes(keyword.toLowerCase())) {
                    return 'Other';
                }
            }
        }

        // If no match found anywhere, return 'Other' as the catch-all
        return 'Other';
    }

    // Count projects for each category and update button text
    function updateButtonCounts() {
        const projectButtons = document.querySelectorAll('project-button, tr.mat-mdc-row');
        const categoryCounts = {};

        // Initialize counts
        Object.keys(categories).forEach(cat => {
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

        GM_log('Updated button counts:', categoryCounts);
    }

    // Filter projects
    function filterProjects(selectedCategory) {
        GM_log(`Filtering by: ${selectedCategory}`);
        const projectButtons = document.querySelectorAll('project-button, tr.mat-mdc-row'); // Select all project cards

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
        GM_setValue(ACTIVE_FILTER_KEY, selectedCategory);
        GM_log(`Saved active filter: ${selectedCategory}`);
    }

    // Create the filter UI
    function createFilterUI(targetContainer) {
        // Only create if it doesn't exist
        if (document.querySelector('.category-filter-container')) {
            GM_log("Filter UI already exists. Skipping creation.");
            // Update counts and ensure the filter reflects the last known state
            updateButtonCounts();
            const lastFilter = GM_getValue(ACTIVE_FILTER_KEY, 'All'); // Default to 'All' if nothing saved
            filterProjects(lastFilter);
            return;
        }
        GM_log("Creating Filter UI...");

        const filterContainer = document.createElement('div');
        filterContainer.className = 'category-filter-container';

        Object.keys(categories).forEach(categoryName => {
            const button = document.createElement('button');
            button.className = 'category-filter-button';
            button.setAttribute('data-category', categoryName);
            button.textContent = categoryName;
            button.addEventListener('click', () => filterProjects(categoryName));
            filterContainer.appendChild(button);
        });

        // Insert the buttons before the project flow container
        targetContainer.parentNode.insertBefore(filterContainer, targetContainer);

        // Update button counts
        updateButtonCounts();

        // Apply the previously saved filter, or 'All' if none
        const lastFilter = GM_getValue(ACTIVE_FILTER_KEY, 'All');
        GM_log(`Applying initial/restored filter: ${lastFilter}`);
        filterProjects(lastFilter);
    }

    // Wait for the project container to appear (repeatedly)
    document.arrive('.project-buttons-flow, table.mdc-data-table__table', { existing: true }, function(element) {
        GM_log("Project container arrived or already exists.");
        createFilterUI(element);
    });

    GM_log("NotebookLM Categorizer Script Loaded (SPA-Aware)");

})();
