"use strict"; // Enable strict mode
(function () {

// variable elements to select
    const roastSelection = document.querySelector('#roast-selection');
    const nameSelection = document.querySelector('#name-selection');
    const addRoastButton = document.querySelector('#add-submit');

// Default coffee data with id, names, and roast types
    let coffees = [
        {id: 1, name: 'Light City', roast: 'light'},
        {id: 2, name: 'Half City', roast: 'light'},
        {id: 3, name: 'Cinnamon', roast: 'light'},
        {id: 4, name: 'City', roast: 'medium'},
        {id: 5, name: 'American', roast: 'medium'},
        {id: 6, name: 'Breakfast', roast: 'medium'},
        {id: 7, name: 'High', roast: 'dark'},
        {id: 8, name: 'Continental', roast: 'dark'},
        {id: 9, name: 'New Orleans', roast: 'dark'},
        {id: 10, name: 'European', roast: 'dark'},
        {id: 11, name: 'Espresso', roast: 'dark'},
        {id: 12, name: 'Viennese', roast: 'dark'},
        {id: 13, name: 'Italian', roast: 'dark'},
        {id: 14, name: 'French', roast: 'dark'},
    ];

//Load coffee data
    loadCoffees()

// Function to create a coffee element in the DOM
    function createCoffee(coffee) {
        const coffeeDiv = document.createElement("div");
        coffeeDiv.classList.add("coffee")
        coffeeDiv.innerHTML = `<h3>${firstLetterUpperCase(coffee.name)}</h3><p>${firstLetterUpperCase(coffee.roast)}</p> `
        document.querySelector(".coffee-display").appendChild(coffeeDiv)
    }

// Function to render a list of coffees in the DOM
    function renderCoffees(coffees) {
        for (let i = 0; i < coffees.length; i++) {
            createCoffee(coffees[i])
        }
    }

// Function to update displayed coffees based on filters. FEATURE 1: Case Insensitive Search
    function updateCoffees(e) {
        e.preventDefault(); // Prevent form submission
        document.querySelector(".coffee-display").innerHTML = "";
        const selectedRoast = roastSelection.value.toLowerCase();
        const coffeeNameFilter = nameSelection.value.toLowerCase();
        const filteredCoffees = [];

        // Filter coffees based on selected roast and name filter
        coffees.forEach((coffee) => {
            if (selectedRoast === 'all' || coffee.roast === selectedRoast) {
                if (coffee.name.toLowerCase().includes(coffeeNameFilter)) {
                    filteredCoffees.push(coffee);
                }
            }
        });

        /*For sorting by name or id*/
        let sortOption = document.querySelector("#sort").value
        switch (sortOption) {
            case "name":
                filteredCoffees.sort(function (a, b) {
                    let x = a.name.toLowerCase();
                    let y = b.name.toLowerCase();
                    if (x < y) {
                        return -1;
                    }
                    if (x > y) {
                        return 1;
                    }
                    return 0;
                })
                break;
            case "id":
                filteredCoffees.sort((a, b) => {
                    return a.id - b.id
                })
                break;
        }

        console.log(filteredCoffees)
        renderCoffees(filteredCoffees);
    }


// Function to add a new coffee. FEATURE 2: Add a Coffee
    function addCoffee(e) {
        e.preventDefault();
        const name = document.querySelector("#add-name").value.toLowerCase().trim();
        const roast = document.querySelector("#add-roast").value.toLowerCase();
        const newCoffee = {}

        // Check if the name is not empty
        if (name.length > 0) {
            newCoffee.id = calculateId();
            newCoffee.name = name;
            newCoffee.roast = roast;
            coffees.push(newCoffee);
            localStorage.setItem("savedCoffees", JSON.stringify(coffees))
        }

        // Display an alert if the name is empty
        if (name.length === 0) {
            alert("Name can not be empty")
        }

        updateCoffees(e);

        // Calculate a unique ID for the new coffee
        function calculateId() {
            let highestID = 0;
            for (let coffee of coffees) {
                if (coffee.id > highestID) {
                    highestID = coffee.id
                }
            }
            return highestID + 1
        }
    }

// Render the initial list of coffees
    renderCoffees(coffees)


// Function to capitalize the first letter of a string. FEATURE 3: Capitalize first letters of strings
    function firstLetterUpperCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

// Function to load saved coffee data from local storage FEATURE 4: Data Persistence Using Local Storage
    function loadCoffees() {
        let load = JSON.parse(localStorage.getItem('savedCoffees'))
        if (load !== null) {
            coffees = load;
        }
        coffees = coffees.sort((a, b) => {
            return a.id - b.id
        })
    }


// Event listener for input in the name selection field
    nameSelection.addEventListener('input', (e) => {
        updateCoffees(e);
    });

// Event listener for clicking the add coffee button
    addRoastButton.addEventListener('click', (e) => {
        addCoffee(e);
    });

// Event listener for changing the roast selection
    roastSelection.addEventListener("change", (e) => {
        updateCoffees(e)
    });

// Event listener for sorting coffee
    document.querySelector("#sort").addEventListener("change", (e) => {
        updateCoffees(e)
    })

// Clear local storage with Konami code FEATURE 5: Konami code to remove added Coffee and go to Default
    let position = 0;
    document.addEventListener("keyup", e => {
        const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "a", "b", "b"]
        console.log(e.key)
        if (konamiCode[position] === e.key) {
            position++
        } else {
            position = 0
        }
        if (position === konamiCode.length) {
            position = 0
            localStorage.removeItem("savedCoffees");
            location.reload()
        }
    })
})();


