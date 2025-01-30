// Initialize scales
function createScale(containerId, hiddenInputId) {
    const container = document.getElementById(containerId);
    const hiddenInput = document.getElementById(hiddenInputId);

    for (let i = 1; i <= 10; i++) {
        const number = document.createElement("div");
        number.className = "scale-number";
        number.textContent = i;

        // Color calculation
        let hue;
        if (i <= 5) {
            hue = (i - 1) * 15;
        } else if (i <= 7) {
            hue = 60 + (i - 5) * 30;
        } else {
            hue = 120 + (i - 7) * 40;
        }

        number.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

        number.addEventListener("click", () => {
            Array.from(container.children).forEach((child) => {
                child.classList.remove("active");
            });
            number.classList.add("active");
            hiddenInput.value = i;
        });

        container.appendChild(number);
    }
}

// Initialize form
function initForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const person = urlParams.get('person');

    // Set default datetime
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - timezoneOffset).toISOString().slice(0, 16);
    document.getElementById("datetime").value = localISOTime;

    // Get config from data attributes
    const scriptEl = document.querySelector('script[data-config]');
    const config = JSON.parse(scriptEl.dataset.config);

    // Set images
    document.getElementById("image1").src = config.img1Path;
    document.getElementById("image2").src = config.img2Path;

    // Form submission
    document.getElementById("foodJournal").addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
            Food: document.getElementById("food").value,
            Datetime: document.getElementById("datetime").value,
            SateBefore: document.getElementById("beforeValue").value,
            SateAfter: document.getElementById("afterValue").value,
            Tags: Array.from(document.querySelectorAll('#tags option:checked')).map(el => el.value),
            Person: person
        };

        try {
            const response = await fetch(config.apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Entry saved successfully!');
                e.target.reset();
            } else {
                alert('Error saving entry');
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Connection failed");
        }
    });
}

// Initialize when ready
document.addEventListener('DOMContentLoaded', () => {
    createScale("satietyBefore", "beforeValue");
    createScale("satietyAfter", "afterValue");
    initForm();
});