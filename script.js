const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const profileContainer = document.getElementById("profile-container");
const errorContainer = document.getElementById("error-container");
const avatar = document.getElementById("avatar");
const nameElement = document.getElementById("name");
const usernameElement = document.getElementById("username");
const bioElement = document.getElementById("bio");
const locationElement = document.getElementById("location");
const joinedDateElement = document.getElementById("joined-date");
const profileLink = document.getElementById("profile-link");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repos = document.getElementById("repos");
const companyElement = document.getElementById("company");
const blogElement = document.getElementById("blog");
const twitterElement = document.getElementById("twitter");
const companyContainer = document.getElementById("company-container");
const blogContainer = document.getElementById("blog-container");
const twitterContainer = document.getElementById("twitter-container");
const reposContainer = document.getElementById("repos-container");

// Changed default username to your GitHub profile
searchBtn.addEventListener("click", searchUser);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchUser();
});

async function searchUser() {
  const username = searchInput.value.trim();

  if (!username) {
    showNotification("Please enter a GitHub username", "warning");
    return;
  }

  try {
    // Reset UI with smooth transitions
    profileContainer.classList.add("hidden");
    errorContainer.classList.add("hidden");
    reposContainer.innerHTML = '<div class="loading-repos">Loading profile...</div>';

    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error("User not found");

    const userData = await response.json();
    console.log("User data loaded:", userData);

    displayUserData(userData);
    fetchRepositories(userData.repos_url);
  } catch (error) {
    console.error("Search error:", error);
    showError(error.message);
  }
}

async function fetchRepositories(reposUrl) {
  reposContainer.innerHTML = '<div class="loading-repos"><i class="fas fa-spinner fa-spin"></i> Loading repositories...</div>';

  try {
    const response = await fetch(reposUrl + "?per_page=6&sort=updated&order=desc");
    if (!response.ok) throw new Error("Failed to load repositories");
    
    const repos = await response.json();
    displayRepos(repos);
  } catch (error) {
    reposContainer.innerHTML = `<div class="no-repos"><i class="fas fa-exclamation-triangle"></i> ${error.message}</div>`;
  }
}

function displayRepos(repos) {
  if (repos.length === 0) {
    reposContainer.innerHTML = '<div class="no-repos"><i class="fas fa-inbox"></i> No repositories found</div>';
    return;
  }

  reposContainer.innerHTML = "";

  repos.forEach((repo) => {
    const repoCard = document.createElement("div");
    repoCard.className = "repo-card";

    const updatedAt = formatDate(repo.updated_at);
    const languageColor = repo.language ? getLanguageColor(repo.language) : 'transparent';

    repoCard.innerHTML = `
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">
        <i class="fas fa-code-branch"></i> ${repo.name}
        ${repo.private ? '<span style="font-size: 0.8em; opacity: 0.7;">🔒</span>' : ''}
      </a>
      <p class="repo-description">${repo.description || "No description available"}</p>
      <div class="repo-meta">
        ${repo.language ? `
          <div class="repo-meta-item">
            <i class="fas fa-circle" style="color: ${languageColor};"></i> 
            ${repo.language}
          </div>
        ` : ""}
        <div class="repo-meta-item">
          <i class="fas fa-star"></i> ${formatNumber(repo.stargazers_count)}
        </div>
        <div class="repo-meta-item">
          <i class="fas fa-code-fork"></i> ${formatNumber(repo.forks_count)}
        </div>
        <div class="repo-meta-item">
          <i class="fas fa-history"></i> ${updatedAt}
        </div>
      </div>
    `;

    reposContainer.appendChild(repoCard);
  });
}

function displayUserData(user) {
  // Add loading animation to avatar
  avatar.src = user.avatar_url + (user.avatar_url.includes('?') ? '&' : '?') + 'v=1';
  avatar.style.opacity = '0';
  avatar.onload = () => avatar.style.opacity = '1';

  nameElement.textContent = user.name || user.login;
  usernameElement.textContent = `@${user.login}`;
  bioElement.textContent = user.bio || "No bio available";

  locationElement.innerHTML = user.location ? 
    `<i class="fas fa-map-marker-alt"></i> ${user.location}` : 
    '<i class="fas fa-map-marker-alt" style="opacity: 0.5;"></i> Not specified';

  joinedDateElement.innerHTML = `<i class="fas fa-calendar"></i> ${formatDate(user.created_at)}`;

  profileLink.href = user.html_url;
  followers.textContent = formatNumber(user.followers);
  following.textContent = formatNumber(user.following);
  repos.textContent = formatNumber(user.public_repos);

  // Company
  updateInfoItem(companyContainer, companyElement, user.company, "fas fa-building", "Not specified");

  // Blog/Website
  updateInfoItem(blogContainer, blogElement, user.blog, "fas fa-globe", "No website", (url) => 
    url.startsWith("http") ? url : `https://${url}`
  );

  // Twitter
  if (user.twitter_username) {
    twitterElement.textContent = `@${user.twitter_username}`;
    twitterElement.href = `https://twitter.com/${user.twitter_username}`;
    twitterContainer.style.display = "flex";
  } else {
    updateInfoItem(twitterContainer, twitterElement, "No Twitter", "fab fa-twitter", "No Twitter");
  }

  // Smooth reveal animation
  profileContainer.classList.remove("hidden");
  profileContainer.style.animation = "fadeInUp 0.6s ease forwards";
}

function updateInfoItem(container, element, value, iconClass, fallback, urlFormatter = null) {
  if (value && value !== fallback) {
    element.innerHTML = `<i class="${iconClass}"></i> ${value}`;
    if (urlFormatter) {
      element.href = urlFormatter(value);
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    }
    container.style.display = "flex";
  } else {
    element.innerHTML = `<i class="${iconClass}" style="opacity: 0.5;"></i> ${fallback}`;
    container.style.display = value ? "flex" : "none";
  }
}

function showError(message = "Something went wrong") {
  errorContainer.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i>
    <div>${message}</div>
    <small>Try a different username or check your connection</small>
  `;
  errorContainer.classList.remove("hidden");
}

function showNotification(message, type = "info") {
  // Create temporary notification
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 15px 20px;
    background: rgba(14, 165, 233, 0.95); color: white; border-radius: 12px;
    backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000; transform: translateX(400px); opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  `;
  document.body.appendChild(notification);
  
  requestAnimationFrame(() => {
    notification.style.transform = "translateX(0)";
    notification.style.opacity = "1";
  });
  
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 400);
  }, 3000);
}

// Utility Functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

function getLanguageColor(language) {
  const colors = {
    'JavaScript': '#f7df1e',
    'TypeScript': '#3178c6',
    'Python': '#3776ab',
    'Java': '#007396',
    'C++': '#f34b7d',
    'HTML': '#e34f26',
    'CSS': '#1572b6',
    'React': '#61dafb',
    'Vue': '#42b883',
    'Node.js': '#339933'
  };
  return colors[language] || '#6b7280';
}

// Load your profile by default
searchInput.value = "your-github-username"; // 👈 CHANGE THIS TO YOUR ACTUAL GITHUB USERNAME
searchUser();
