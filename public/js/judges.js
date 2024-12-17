// public/js/judges.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Listen for leaderboard updates
    socket.on('update-leaderboard', (data) => {
        console.log('Score updated:', data);
        const leaderboardElement = document.getElementById('leaderboard');
        
        // Fetch the updated leaderboard data
        fetch('/leaderboard') // Assuming you have a route to fetch the leaderboard
            .then(response => response.json())
            .then(leaderboardData => {
                leaderboardElement.innerHTML = ''; // Clear existing leaderboard entries
                leaderboardData.forEach(team => {
                    const li = document.createElement('li');
                    li.textContent = `Team: ${team.teamName} - Total Score: ${team.totalScore}`;
                    leaderboardElement.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching leaderboard:', error));
    });

    // Listen for score updates and evaluated status changes
    socket.on('scoreUpdated', (data) => {
        console.log('Score updated:', data);

        // Find the corresponding team section using the data-team-id attribute
        const teamSection = document.querySelector(`[data-team-id="${data.teamId}"]`);
        if (teamSection) {
            // Update the evaluated status text
            const statusElement = teamSection.querySelector('.status');
            statusElement.textContent = data.evaluated ? 'Evaluated' : 'Not Evaluated';

            // Remove the toggle button if the team is now evaluated
            if (data.evaluated) {
                const toggleButton = teamSection.querySelector('.btn');
                if (toggleButton) {
                    toggleButton.remove();
                }
            }
        }
    });
});

