const apiUrl = 'http://localhost:3000/api';
let currentUser = null;

// Admin Login Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const adminUsername = document.getElementById('adminUsername').value;
            const adminPassword = document.getElementById('adminPassword').value;

            if (adminUsername === 'admin' && adminPassword === 'Nandin2920') {
                window.location.href = '/admin-dashboard';
            } else {
                alert('Invalid login credentials');
            }
        });
    }

    const userLoginForm = document.getElementById('userLoginForm');
    if (userLoginForm) {
        userLoginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const loginUsername = document.getElementById('loginUsername').value;
            const loginPassword = document.getElementById('loginPassword').value;

            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: loginUsername, password: loginPassword }),
            });

            if (response.ok) {
                const data = await response.json();
                currentUser = loginUsername;
                window.location.href = '/user-dashboard';
            } else {
                alert('Invalid login credentials or your application is not approved yet.');
            }
        });
    }

    const dataUploadForm = document.getElementById('dataUploadForm');
    if (dataUploadForm) {
        dataUploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const dataFile = document.getElementById('dataFile').files[0];
            const message = document.getElementById('message').value;

            if (dataFile && message) {
                alert('Data uploaded and message set successfully.');
                // Here you would typically process and send the data to your backend
            } else {
                alert('Please upload a data file and choose a message.');
            }
        });
    }

    async function loadPendingApplications() {
        const response = await fetch(`${apiUrl}/admin/pending`);
        if (response.ok) {
            const users = await response.json();
            const applicationsList = document.getElementById('applicationsList');
            applicationsList.innerHTML = '';

            users.forEach(user => {
                const applicationDiv = document.createElement('div');
                applicationDiv.classList.add('application');
                applicationDiv.innerHTML = `
                    <p>Username: ${user.username}</p>
                    <p>Organization Type: ${user.orgType}</p>
                    <p>Description: ${user.description}</p>
                    <button onclick="approveUser('${user._id}')">Approve</button>
                `;
                applicationsList.appendChild(applicationDiv);
            });
        } else {
            alert('Failed to load pending applications');
        }
    }

    async function approveUser(userId) {
        const response = await fetch(`${apiUrl}/admin/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (response.ok) {
            loadPendingApplications();
        } else {
            alert('Failed to approve user');
        }
    }

    if (window.location.pathname === '/admin-dashboard') {
        loadPendingApplications();
    }
});
