// // Main application initialization
// document.addEventListener('DOMContentLoaded', () => {
//     // Initialize filters
//     initializeFilters();
    
//     // Display all products initially
//     displayProducts(products);
    
//     // Initialize Stripe
//     const stripe = Stripe(CONFIG.STRIPE_KEY);
//   });
  
//   // Mobile menu toggle
//   function toggleMenu() {
//     const menu = document.querySelector('.menu');
//     const hamburger = document.querySelector('.hamburger');
//     menu.classList.toggle('active');
//     hamburger.classList.toggle('active');
//   }
  
  
//   // Language change handler
//   function changeLanguage() {
//     const language = document.getElementById('language-dropdown').value;
//     // Implement language change logic here
//     console.log('Changed language to:', language);
//   }