const cardContainer = $(".card-container");
const removeButton = $(".remove-button");
const allButton = $("#all-button");
const activeButton = $("#active-button");
const inactiveButton = $("#inactive-button");

const allData = [];
const activeData = [];
const inactiveData = [];

const buttonSelections = [allButton, activeButton, inactiveButton];

function createCards(data) {
  // Clear existing cards
  cardContainer.empty();

  // Create a document fragment for better performance
  const fragment = $(document.createDocumentFragment());

  data.forEach((item) => {
    const card = $(`
      <div class="card" data-id="${item.id}">
        <div class="card-info">
          <img src="${item.logo}" alt="${item.name}" />
          <div>
            <h3>${item.name}</h3>        
            <p>${item.description}</p>
          </div>
        </div>

        <div class="card-button-container">
          <button class="remove-button">Remove</button>
          <div class="toggle-wrapper ${item.isActive && `active`}">
            <div class="toggle ${item.isActive && `active`}"></div>
        </div>
        </div>
      </div>
      `);

    fragment.append(card);
  });

  cardContainer.append(fragment);
}

function handleActivationToggle(item) {
  item.isActive = !item.isActive;
  if (item.isActive) {
    inactiveData.splice(inactiveData.indexOf(item), 1);
    activeData.push(item);
  } else {
    activeData.splice(activeData.indexOf(item), 1);
    inactiveData.push(item);
  }

  const selectedButton = buttonSelections.find((button) =>
    button.hasClass("selected")
  );
  if (selectedButton === allButton) {
    createCards(allData);
  } else if (selectedButton === activeButton) {
    createCards(activeData);
  } else if (selectedButton === inactiveButton) {
    createCards(inactiveData);
  }
}

function removeCard(id) {
  // Remove the card from allData, activeData, and inactiveData
  const itemIndex = allData.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    const removedItem = allData[itemIndex];
    allData.splice(itemIndex, 1);

    if (removedItem.isActive) {
      activeData.splice(activeData.indexOf(removedItem), 1);
    } else {
      inactiveData.splice(inactiveData.indexOf(removedItem), 1);
    }

    // Check which button is selected and update the displayed cards
    const selectedButton = buttonSelections.find((button) =>
      button.hasClass("selected")
    );
    if (selectedButton === allButton) {
      createCards(allData);
    } else if (selectedButton === activeButton) {
      createCards(activeData);
    } else if (selectedButton === inactiveButton) {
      createCards(inactiveData);
    }
  }
}

function handleButtonClick(selectedButton, dataToShow) {
  // Remove selected class from all buttons and add to the clicked button
  buttonSelections.forEach((button) => {
    button.removeClass("selected");
  });
  selectedButton.addClass("selected");

  createCards(dataToShow);
}

// Remove card on button click

$(document).ready(() => {
  $.getJSON("/data.json", (data) => {
    data.forEach((item, index) => {
      item.id = index; // Add an ID to each item
      allData.push(item);

      if (item.isActive) {
        activeData.push(item);
      } else {
        inactiveData.push(item);
      }
    });

    // Initialize the page with all data
    createCards(allData);
  });
});

// Event listeners for buttons
allButton.on("click", () => handleButtonClick(allButton, allData));
activeButton.on("click", () => handleButtonClick(activeButton, activeData));
inactiveButton.on("click", () =>
  handleButtonClick(inactiveButton, inactiveData)
);

// Event listeners for toggle
cardContainer.on("click", ".toggle-wrapper", function () {
  const cardElement = $(this).closest(".card");
  const itemId = cardElement.data("id");
  const item = allData.find((item) => item.id === itemId);

  if (item) {
    handleActivationToggle(item);
  }
});

// Event listener for remove button
cardContainer.on("click", ".remove-button", function () {
  const cardElement = $(this).closest(".card");
  const itemId = cardElement.data("id");

  removeCard(itemId);
});

// Event listener for theme toggle
$(".theme-toggle").on("click", () => {
  $("html").attr("data-theme") === "light"
    ? $("html").attr("data-theme", "dark")
    : $("html").attr("data-theme", "light");
});
