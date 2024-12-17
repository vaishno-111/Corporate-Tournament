// public/js/leaderboard.js
const socket = io();

socket.on('update-leaderboard', async (data) => {
    const { eventId } = data;
    try {
        // Fetch the updated leaderboard for the event
        const response = await fetch(`/leaderboard/${eventId}`);
        const teams = await response.json();

        const leaderboard = document.getElementById(`leaderboard-${eventId}`);
        leaderboard.innerHTML = ''; // Clear the current leaderboard

        // Populate the leaderboard with updated data
        teams.forEach((team, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${team.teamName}: ${team.totalScore}`;
            leaderboard.appendChild(li);
        });
    } catch (error) {
        console.error('Error updating leaderboard:', error);
    }
});
