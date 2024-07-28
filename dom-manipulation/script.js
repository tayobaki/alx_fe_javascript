let quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Motivation",
  },
  {
    text: "Do not watch the clock. Do what it does. Keep going.",
    category: "Motivation",
  },
  {
    text: "Success is not the key to happiness. Happiness is the key to success.",
    category: "Success",
  },
];

// Load quotes from local storage if available
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
}

document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  showRandomQuote();

  const lastCategory = localStorage.getItem("selectedCategory");
  if (lastCategory) {
    document.getElementById("categoryFilter").value = lastCategory;
    filterQuotes();
  }

  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", () => {
    filterQuotes();
    localStorage.setItem(
      "selectedCategory",
      document.getElementById("categoryFilter").value
    );
  });
});

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = quotes[randomIndex].text;
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    postQuoteToServer(newQuote);
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
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

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById("quoteDisplay").textContent =
      filteredQuotes[randomIndex].text;
  } else {
    document.getElementById("quoteDisplay").textContent =
      "No quotes available for this category.";
  }
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

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
