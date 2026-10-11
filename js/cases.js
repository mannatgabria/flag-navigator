// Henter alle lagrede saker 
let cases = JSON.parse(
    localStorage.getItem("flagNavigatorCases")
) || [];

let currentCase = cases.length > 0 ? cases[0] : null;

//Lagrer alle saker
function saveCases() {

    localStorage.setItem(
        "flagNavigatorCases",
        JSON.stringify(cases)
    );
}

// Oppretter ny sak
function createCase(name) {
    const newCase = { id: Date.now(), name: name, events: [], result: null };

    cases.push(newCase);
    currentCase = newCase;
    saveCases();
    renderCases();

}

// Velger aktiv sak
function selectCase(id) {
    currentCase = cases.find(c => c.id === id);

    renderCases();

}

// Sletter en sak
function deleteCase(id) {
    const confirmed = confirm("Delete this case?");

    if (!confirmed) return;

    cases = cases.filter(c => c.id !== id);

    if (currentCase && currentCase.id === id) {

        currentCase = cases.length > 0 ? cases[0] : null;

    }
    saveCases();
    renderCases();

}

// Endrer navn på en sak

function renameCase(id) {
    const selectedCase = cases.find(c => c.id === id);

    if (!selectedCase)
        return;

    const newName = prompt("New case name", selectedCase.name);

    if (!newName)
        return;

    selectedCase.name = newName.trim();

    saveCases();
    renderCases();
}

//Legger til en hendelse
function addEventToCurrentCase(eventText) {

    if (!currentCase)
        return;

    currentCase.events.push({ id: Date.now(), text: eventText, createdAt: new Date().toISOString() });

    saveCases();

}

//Viser alle saker
function renderCases() {
    const list = document.getElementById("casesList");

    if (!list)
        return;

    list.innerHTML = "";

    cases.forEach(c => {

        const card = document.createElement("div");

        card.className = "case-card";

        if (currentCase && currentCase.id === c.id) {
            card.classList.add("active");
        }

       card.innerHTML = `
            <h3>${c.name}</h3>
            <p>${c.events.length} event(s)</p>
            <button class="rename-case">
                Rename
            </button>
            <button class="delete-case">
                Delete
            </button>
        `;

        card.onclick = () => selectCase(c.id);

        card.querySelector(".rename-case").onclick = (e) => {
                e.stopPropagation();
                renameCase(c.id);
            };

        card.querySelector(".delete-case").onclick = (e) => {
                e.stopPropagation();
                deleteCase(c.id);
            };

        list.appendChild(card);

    });

}

//Oppretter ny sak fra knapp
function addNewCase() {
    const name = prompt("Case name");

    if(!name)
        return;

    createCase(name.trim());
}

//Starter system
window.addEventListener(
    "DOMContentLoaded", () => {
        renderCases();
    }
);