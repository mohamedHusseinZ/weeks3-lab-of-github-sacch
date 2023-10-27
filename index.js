// const fetch = require('node-fetch'); // For Node.js, if you're using a browser, you can omit this line

// URL for user search
const userSearchURL = 'https://api.github.com/search/users?q=octocat';
// URL for user repositories
const userReposURL = 'https://api.github.com/users/octocat/repos';

// Function to fetch data from a URL
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Fetch data from the user search URL
fetchData(userSearchURL)
  .then(data => {
    console.log('Data from user search:', data);
    // You can access specific data fields from the response data here
  });

// Fetch data from the user repositories URL
fetchData(userReposURL)
  .then(data => {
    console.log('Data from user repositories:', data);
    // You can access specific data fields from the response data here
  });

  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const userList = document.getElementById('user-list');
  const reposList = document.getElementById('repos-list');

  searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value;

      // Clear previous search results
      userList.innerHTML = '';
      reposList.innerHTML = '';

      // Perform user search using the GitHub API
      const userSearchURL = `https://api.github.com/search/users?q=${searchTerm}`;
      const userSearchResponse = await fetch(userSearchURL);
      const userData = await userSearchResponse.json();

      if (userData.items && userData.items.length > 0) {
          userData.items.forEach(user => {
              const userDiv = document.createElement('div');
              userDiv.innerHTML = `
                  <img src="${user.avatar_url}" alt="${user.login}" width="50">
                  <p><strong>${user.login}</strong></p>
                  <a href="${user.html_url}" target="_blank">GitHub Profile</a>
              `;
              userDiv.addEventListener('click', async () => {
                  // Fetch user's repositories when clicked
                  const reposURL = user.repos_url;
                  const reposResponse = await fetch(reposURL);
                  const reposData = await reposResponse.json();
                  displayRepositories(reposData);
              });
              userList.appendChild(userDiv);
          });
      } else {
          userList.innerHTML = '<p>No users found.</p>';
      }
  });

  function displayRepositories(repositories) {
      reposList.innerHTML = '';
      if (repositories.length > 0) {
          repositories.forEach(repo => {
              const repoDiv = document.createElement('div');
              repoDiv.innerHTML = `
                  <p><strong>${repo.name}</strong></p>
                  <p>${repo.description || 'No description'}</p>
                  <a href="${repo.html_url}" target="_blank">Repository Link</a>
              `;
              reposList.appendChild(repoDiv);
          });
      } else {
          reposList.innerHTML = '<p>No repositories found for this user.</p>';
      }
  }