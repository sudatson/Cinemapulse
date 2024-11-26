async function submitFeedback() {
    const feedback = document.getElementById('feedback').value;

    if (!feedback.trim()) {
        alert('Please provide feedback!');
        return;
    }

    const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
    });

    const data = await response.json();

    if (response.ok) {
        alert('Feedback submitted successfully!');
        document.getElementById('feedback').value = ''; // Clear the textarea
        fetchSentiments(); // Refresh sentiment data
    } else {
        alert(`Error: ${data.error}`);
    }
}

async function fetchSentiments() {
    const response = await fetch('http://localhost:5000/api/sentiments');
    const data = await response.json();

    const sentimentList = document.getElementById('sentiment-list');
    sentimentList.innerHTML = ''; // Clear previous data

    data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>Feedback:</strong> ${item.feedback} <br> <strong>Sentiment:</strong> ${item.sentiment}`;
        sentimentList.appendChild(listItem);
    });
}

// Automatically fetch sentiments every 5 seconds
setInterval(fetchSentiments, 5000);
