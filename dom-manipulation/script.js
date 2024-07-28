// Array to store quotes
let quotes = [
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  {
    text: "The only way to do great work is to love what you do.",
    category: "Work",
  },
  {
    text: "In three words I can sum up everything I've learned about life: it goes on.",
    category: "Life",
  },
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}" - <em>${quote.category}</em></p>`;
}

// Function to create and display the form for adding new quotes
function createAddQuoteForm() {
  const form = document.createElement("form");
  form.innerHTML = `
        <input type="text" id="newQuoteText" placeholder="Enter a new quote" required>
        <input type="text" id="newQuoteCategory" placeholder="Enter quote category" required>
        <button type="submit">Add Quote</button>
    `;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addQuote();
  });
  document.body.appendChild(form);
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const newQuote = {
    text: textInput.value,
    category: categoryInput.value,
  };
  quotes.push(newQuote);
  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added successfully!");
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
window.addEventListener("load", function () {
  showRandomQuote();
  createAddQuoteForm();
});

// ... (previous code)

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Modify addQuote function to save to local storage
function addQuote() {
  // ... (previous code)
  saveQuotes();
}

// Function to export quotes as JSON
function exportQuotes() {
  const jsonStr = JSON.stringify(quotes);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Add these to the window.addEventListener('load', ...) function
loadQuotes();
document.body.innerHTML += `
    <button onclick="exportQuotes()">Export Quotes</button>
    <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)">
`;

// ... (previous code)

// Function to populate category filter
function populateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [
    "All Categories",
    ...new Set(quotes.map((q) => q.category)),
  ];
  categoryFilter.innerHTML = categories
    .map((cat) => `<option value="${cat}">${cat}</option>`)
    .join("");
}

// Function to filter quotes
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    category === "All Categories"
      ? quotes
      : quotes.filter((q) => q.category === category);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filteredQuotes
    .map((q) => `<p>"${q.text}" - <em>${q.category}</em></p>`)
    .join("");

  // Save last selected category to local storage
  localStorage.setItem("lastCategory", category);
}

// Modify window.addEventListener('load', ...) function
window.addEventListener("load", function () {
  loadQuotes();
  populateCategoryFilter();
  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) {
    document.getElementById("categoryFilter").value = lastCategory;
  }
  filterQuotes();
  createAddQuoteForm();
});

// Add this to the HTML
// <select id="categoryFilter" onchange="filterQuotes()"></select>

// ... (previous code)

// Simulated server URL (replace with actual API if available)
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Function to fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    // Simulate converting server data to our quote format
    return data.slice(0, 5).map((item) => ({
      text: item.title,
      category: "Server Quote",
    }));
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
}

// Function to sync quotes with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const mergedQuotes = [...quotes, ...serverQuotes];
  // Simple conflict resolution: remove duplicates based on text
  quotes = Array.from(new Set(mergedQuotes.map((q) => q.text))).map((text) =>
    mergedQuotes.find((q) => q.text === text)
  );

  saveQuotes();
  populateCategoryFilter();
  filterQuotes();
  notifyUser("Quotes synced with server");
}

// Function to notify user
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed; top: 10px; right: 10px;
        background: #333; color: white; padding: 10px;
        border-radius: 5px;
    `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Simulate periodic syncing
setInterval(syncQuotes, 60000); // Sync every minute

// Add sync button to UI
document.body.innerHTML +=
  '<button onclick="syncQuotes()">Sync Quotes</button>';
