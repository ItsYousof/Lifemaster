function closePopup() {
    const popup = document.querySelector('.popup');
    popup.classList.remove('show');
    setTimeout(() => popup.style.display = 'none', 500);
}

function openPopup() {
    const popup = document.querySelector('.popup');
    if (popup.classList.contains('show')) {
        popup.classList.remove('show');
        // Optional: Add a delay before hiding to allow animation to complete
        setTimeout(() => popup.style.display = 'none', 500);
    } else {
        popup.style.display = 'block';
        setTimeout(() => popup.classList.add('show'), 10); // Slight delay to ensure display change is registered
    }
}

const descriptions = [
    ["Alexandria", "Historic Egyptian city with a rich cultural heritage, Mediterranean coastline, and ancient wonders like the Library of Alexandria."],
    ["San Diego", "California city known for its beaches, parks, warm climate, and attractions like the San Diego Zoo and Balboa Park."],
    ["Anna Maria Island", "Charming barrier island in Florida, offering pristine beaches, clear waters, and a relaxed, laid-back atmosphere."],
    ["Paris", "Capital of France, famed for its art, fashion, and landmarks such as the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral."],
    ["London", "England’s capital, renowned for its history, culture, iconic landmarks like Big Ben, the Tower of London, and Buckingham Palace."],
    ["Barcelona", "Vibrant Spanish city, known for its unique architecture by Gaudí, bustling streets, beaches, and rich cultural scene."]
];

function showPopupDescription(title, imgSrc) { 
    const popup = document.querySelector('.popup');
    const popupImg = document.querySelector('#popup-img');
    const popupTitle = document.querySelector('#popup-title');
    const popupDescription = document.querySelector('#popup-description');

    const description = descriptions.find(d => d[0] === title);
    if (description) {
        popupImg.src = imgSrc;
        popupTitle.textContent = description[0];
        popupDescription.textContent = description[1];
        openPopup();
    }
}