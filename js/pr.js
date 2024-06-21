document.addEventListener('DOMContentLoaded', function () {
    const planButtons = document.querySelectorAll('.plan .btn');
    const planInput = document.getElementById('plan');

    planButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const selectedPlan = this.closest('.plan').querySelector('h3').textContent;
            planInput.value = selectedPlan;
            document.getElementById('payment').scrollIntoView({ behavior: 'smooth' });
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const planButtons = document.querySelectorAll('.plan .btn');
    const planInput = document.getElementById('plan');
    const cardNumberInput = document.getElementById('card-number');
    const cardIcon = document.getElementById('card-icon');

    planButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const selectedPlan = this.closest('.plan').querySelector('h3').textContent;
            planInput.value = selectedPlan;
            document.getElementById('payment').scrollIntoView({ behavior: 'smooth' });
        });
    });

    cardNumberInput.addEventListener('input', function () {
        const cardType = getCardType(cardNumberInput.value);
        cardIcon.className = 'card-icon'; // Reset card icon class
        if (cardType) {
            cardIcon.classList.add('fa-brands', `fa-cc-${cardType}`);
        }
    });

    function getCardType(number) {
        // Regular expressions to identify card types
        const cardPatterns = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            discover: /^6(?:011|5[0-9]{2})/,
            // Add more card patterns as needed
        };

        for (let card in cardPatterns) {
            if (cardPatterns[card].test(number)) {
                return card;
            }
        }
        return null;
    }
});
