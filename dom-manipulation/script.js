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

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map((quote) => quote.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
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

function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Add these to the window.addEventListener('load', ...) function
loadQuotes();
document.body.innerHTML += `
    <button onclick="exportQuotes()">Export Quotes</button>
    <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)">
`;

// ... (previous code)

// Function to populate category filter
// function populateCategoryFilter() {
//   const categoryFilter = document.getElementById("categoryFilter");
//   const categories = [
//     "All Categories",
//     ...new Set(quotes.map((q) => q.category)),
//   ];
//   categoryFilter.innerHTML = categories
//     .map((cat) => `<option value="${cat}">${cat}</option>`)
//     .join("");
// }

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

  localStorage.setItem("lastCategory", category);
}


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


const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();
    quotes = mergeQuotes(quotes, serverQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes synchronized with server!");
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

function mergeQuotes(localQuotes, serverQuotes) {
  const mergedQuotes = [...localQuotes];
  serverQuotes.forEach((serverQuote) => {
    if (
      !localQuotes.some((localQuote) => localQuote.text === serverQuote.text)
    ) {
      mergedQuotes.push(serverQuote);
    }
  });
  return mergedQuotes;
}

async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

setInterval(fetchQuotesFromServer, 300000); // Sync every 5 minutes

// Add sync button to UI
document.body.innerHTML +=
  '<button onclick="syncQuotes()">Sync Quotes</button>';
