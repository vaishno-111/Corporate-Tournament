// public/js/main.js
const socket = io();

// Listen for real-time registration updates
socket.on('update-registrations', (data) => {
  const registrationsDiv = document.getElementById('registrations');
  const newRegistration = document.createElement('p');
  newRegistration.textContent = `Team ${data.teamName} registered for ${data.eventName}`;
  registrationsDiv.appendChild(newRegistration);
});

// Listen for real-time leaderboard updates
socket.on('update-leaderboard', (data) => {
  const leaderboardDiv = document.getElementById('leaderboard');
  const newScore = document.createElement('p');
  newScore.textContent = `Team ${data.teamName} scored ${data.points} points`;
  leaderboardDiv.appendChild(newScore);
});
