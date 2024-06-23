function addHabit(name, times) { 
    const newHabit = document.createElement('div');
    newHabit.classList.add('habit');
    newHabit.innerHTML = `
        <p>${name}</p>
        <span id="timestamp">${times} times per week</span>
        <div class="week">
            <div class="circle" class="active">Mon</div>
            <div class="circle">Tue</div>
            <div class="circle">Wed</div>
            <div class="circle">Tru</div>
            <br>
            <div class="circle">Fri</div>
            <div class="circle">Sat</div>
            <div class="circle">Sun</div>
        </div>
        <button class="btn" onclick="removeHabit(this)"><i class="fa-solid fa-trash"></i></button>
        <button class="btn" onclick="Checkdone()"><i class="fa-solid fa-check"></i></button>
    `;

    document.getElementById('habitsContainer').appendChild(newHabit);
    localStorage.setItem('habits', document.getElementById('habitsContainer').innerHTML);
}


function removeHabit(element) {
    element.parentElement.remove();
    localStorage.setItem('habits', document.getElementById('habitsContainer').innerHTML);
    console.log('removing');
}



document.addEventListener('DOMContentLoaded', function () {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
        document.getElementById('habitsContainer').innerHTML = savedHabits;
    }
});

function openHabit() {
    const popup = document.getElementById('habitPopup');
    if (popup.classList.contains('show')) {
        popup.classList.remove('show');
        // Optional: Add a delay before hiding to allow animation to complete
        setTimeout(() => popup.style.display = 'none', 500);
    } else {
        popup.style.display = 'block';
        setTimeout(() => popup.classList.add('show'), 10); // Slight delay to ensure display change is registered
    }
}

function closeHabit() {
    const popup = document.getElementById('habitPopup');
    popup.classList.remove('show');
    setTimeout(() => popup.style.display = 'none', 500);
}

function saveHabit() {
    const name = document.getElementById('name').value;
    const times = document.getElementById('times').value;
    addHabit(name, times);
    closeHabit();
}
document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Load custom days from localStorage
    let customDays = JSON.parse(localStorage.getItem('customDays')) || [];

    function generateCalendar(month, year) {
        calendar.innerHTML = '';
        const firstDay = new Date(year, month).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();

        // Create empty cells for days of the previous month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day');
            calendar.appendChild(emptyCell);
        }

        // Create cells for each day of the current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.textContent = i;
            dayCell.dataset.day = i;
            dayCell.dataset.month = month;
            dayCell.dataset.year = year;

            // Highlight today
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayCell.classList.add('today');
            }

            // Highlight custom days
            customDays.forEach(customDay => {
                if (i === customDay.day && month === customDay.month && year === customDay.year) {
                    dayCell.classList.add('custom-day');
                }
            });

            dayCell.addEventListener('click', function () {
                Checkdone(i, month, year);
            });

            calendar.appendChild(dayCell);
        }

        let circles = document.querySelectorAll('.circle');
        circles.forEach(circle => {
            circle.addEventListener('click', () => {
                if (circle.classList.contains('active')) {
                    circle.classList.remove('active');
                } else {
                    circle.classList.add('active');
                    localStorage.setItem('habits', document.getElementById('habitsContainer').innerHTML);
                }
            });
        })
    }

    generateCalendar(currentMonth, currentYear);

    // Expose Checkdone function to global scope
    window.Checkdone = Checkdone;

    function Checkdone() {
        const day = new Date().getDate();
        const month = new Date().getMonth();
        const year = new Date().getFullYear();

        const dayCell = document.querySelector(`[data-day="${day}"][data-month="${month}"][data-year="${year}"]`);
        if (dayCell) {
            dayCell.classList.add('custom-day');
            customDays.push({ day, month, year });
            localStorage.setItem('customDays', JSON.stringify(customDays));
        }
    }
});
