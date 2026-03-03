https://shreya-231.github.io/Github_Tracker/
🔍 GitHub Tracker
A sleek, responsive web application that allows users to search for GitHub profiles and view real-time data including repositories, follower counts, and personal bios using the GitHub REST API.

🚀 Live Demo
[(https://shreya-231.github.io/Github_Tracker/)]

✨ Features
Real-time Search: Instantly fetch user data by entering a GitHub username.

Profile Overview: Displays avatar, bio, location, and join date.

Dynamic Stats: Shows the number of followers, following, and public repositories.

Latest Repositories: Automatically lists the user's most recent projects with links.

Error Handling: Custom "User Not Found" states for a better user experience.

Responsive Design: Fully optimized for mobile, tablet, and desktop views.

🛠️ Tech Stack

Technology: Purpose
HTML5: Semantic structure of the application
CSS3: Custom styling and responsive layouts
JavaScript (ES6+): Fetch API integration and DOM manipulation
FontAwesome: Vector icons for visual clarity
GitHub API: Source of real-time user data

⚙️ Installation & Setup

1. Clone the repository

```Bash
git clone https://github.com/your-username/Github_Tracker.git
```
2. Navigate to the project folder

```Bash
cd Github_Tracker
```
3. Open the project

Simply open index.html in your favorite browser.

💡 How it Works
The application uses the native JavaScript fetch() method to query two specific GitHub endpoints:

1. https://api.github.com/users/{username} — For general profile data.

2. https://api.github.com/users/{username}/repos — To retrieve the latest project list.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

1. Fork the Project

2. Create your Feature Branch (git checkout -b feature/AmazingFeature)

3. Commit your Changes (git commit -m 'Add some AmazingFeature')

4.Push to the Branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

📄 License

Distributed under the MIT License. See LICENSE for more information.
