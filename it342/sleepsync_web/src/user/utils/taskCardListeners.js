export const initializeTaskCardListeners = () => {
    const taskCards = document.querySelectorAll('.task-card');

    if (!taskCards || taskCards.length === 0) {
        console.warn("No task cards found to initialize listeners.");
        return;
    }

    taskCards.forEach((card) => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    card.classList.add('completed');
                } else {
                    card.classList.remove('completed');
                }
            });
        }
    });

    console.log("Task card listeners initialized.");
};