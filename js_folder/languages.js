
// Function to load LANGUAGES data from the JSON file
async function loadLanguageData() {
    try {
      const response = await fetch('json_folder/languages.json');  // Path to your JSON file
      const languages = await response.json();         // Parse the JSON data
  
      return languages;
    } catch (error) {
      console.error('Error loading language data:', error);
    }
  }
  
  // Function to change the language
  async function changeLanguage() {
    const selectedLang = document.getElementById('language-dropdown').value;
    const languages = await loadLanguageData();
  
    if (languages) {
      const langData = languages[selectedLang];
  
      // Update page content with selected language
      document.querySelector('h1').textContent = langData.title;
      document.querySelector('.navbar .menu li:nth-child(1) a').textContent = langData.home;
      document.querySelector('.navbar .menu li:nth-child(2) a').textContent = langData.sell;
      document.querySelector('.navbar .menu li:nth-child(3) a').textContent = langData.categories;
      document.querySelector('.navbar .menu li:nth-child(4) a').textContent = langData.cart;
      document.querySelector('.navbar .menu li:nth-child(5) a').textContent = langData.login;
      document.querySelector('.filters label[for="category"]').textContent = langData.categoryLabel;
      document.querySelector('.filters label[for="price"]').textContent = langData.priceLabel;
      document.getElementById('apply-filters').textContent = langData.applyFilters;
      document.querySelector('.cart-modal h3').textContent = langData.cartTitle;
      document.querySelector('.checkout-btn').textContent = langData.checkout;
      document.querySelector('.footer-content p').innerHTML = langData.footerText;
    }
  }
  
  // Load initial language (default is English)
  document.addEventListener('DOMContentLoaded', () => {
    changeLanguage();
  });
  
  
  
  