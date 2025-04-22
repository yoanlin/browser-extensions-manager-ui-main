const cardContainer = document.querySelector(".card-container");
const themeToggle = document.querySelector(".theme-toggle");
const allButton = document.getElementById("all-button");
const activeButton = document.getElementById("active-button");
const inactiveButton = document.getElementById("inactive-button");

const allCardData = [];
const activeCardData = [];
const inactiveCardData = [];

function updateSelectedButton(selectedButton) {
  // Remove 'selected' class from all buttons and add to the selected button
  [allButton, activeButton, inactiveButton].forEach((button) => {
    button.classList.remove("selected");
  });
  selectedButton.classList.add("selected");
}

function createCards(cardData) {
  cardContainer.innerHTML = ""; // Clear existing cards
  cardData.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.innerHTML = `
        <div class="card-info">
          <img src="${card.logo}" alt="${card.name}" />
          <div>
            <h2>${card.name}</h2>
            <p>${card.description}</p>
            </div>              
        </div>

        <div class="card-button-container">
          <button class="remove-button">Remove</button>
          <div class="toggle-wrapper ${card.isActive && "active"}" data-id="${
      card.id
    }">
            <div class='toggle ${card.isActive && "active"}'></div>
          </div>
        </div>         
    `;
    cardContainer.appendChild(cardElement);

    const toggle = cardElement.querySelector(".toggle-wrapper");
    const removeButton = cardElement.querySelector(
      ".card-button-container > button"
    );

    // Add event listener to the toggle button
    toggle.addEventListener("click", () => {
      toggleActiveState(card.id);
    });

    // Add event listener to the remove button
    removeButton.addEventListener("click", () => {
      removeCard(card.id);
    });
  });
}

function removeCard(cardId) {
  const cardIndex = allCardData.findIndex((card) => card.id === cardId);
  if (cardIndex !== -1) {
    allCardData.splice(cardIndex, 1);
    updateCardData();
    createCards(allCardData); // Recreate cards to reflect the removal
  }
}

function handleButtonClick(selectedButton, cardData) {
  updateSelectedButton(selectedButton); // Update selected button
  createCards(cardData); // Create cards based on selected button
}

function toggleActiveState(cardId) {
  const card = allCardData.find((card) => card.id === cardId);
  if (card) {
    card.isActive = !card.isActive; // Toggle the isActive property
    updateCardData(); // Update active and inactive card data arrays

    // Determine which button is currently selected and update the corresponding cards
    if (allButton.classList.contains("selected")) {
      createCards(allCardData);
    } else if (activeButton.classList.contains("selected")) {
      createCards(activeCardData);
    } else if (inactiveButton.classList.contains("selected")) {
      createCards(inactiveCardData);
    }
  }
}

function updateCardData() {
  activeCardData.length = 0; // Clear the activeCardData array
  inactiveCardData.length = 0; // Clear the inactiveCardData array

  allCardData.forEach((card) => {
    if (card.isActive) {
      activeCardData.push(card);
    } else {
      inactiveCardData.push(card);
    }
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  updateSelectedButton(allButton);

  fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((card, index) => {
        card.id = index; // Add an id property to each card
        allCardData.push(card);

        if (card.isActive) {
          activeCardData.push(card);
        } else {
          inactiveCardData.push(card);
        }
      });
      createCards(allCardData); // Create all cards on initial load
    })
    .catch((error) => {
      console.error("Error fetching card data:", error);
    });

  // Show all cards
  allButton.addEventListener("click", () => {
    handleButtonClick(allButton, allCardData);
  });

  // Show active cards
  activeButton.addEventListener("click", () => {
    handleButtonClick(activeButton, activeCardData);
  });

  // Show inactive cards
  inactiveButton.addEventListener("click", () => {
    handleButtonClick(inactiveButton, inactiveCardData);
  });

  themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");

    if (currentTheme === "light") {
      html.setAttribute("data-theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
    }
  });
});
