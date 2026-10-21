# Contributing to DevPulse AI

Thank you for your interest in contributing to **DevPulse AI**! We welcome bug reports, feature suggestions, documentation enhancements, and pull requests.

## 🚀 Development Workflow

1. **Fork or Clone the Repository**:
   ```bash
   git clone https://github.com/Vijay-1710/devpulse-ai.git
   cd devpulse-ai
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make and Test Your Changes**:
   - Launch the local preview: `npm start` or open `index.html`.
   - Verify that all views, presets, and the custom sandbox function as expected.
   - Run the DevPulse audit station to verify that no security or complexity regressions are introduced.

4. **Commit and Push**:
   ```bash
   git add .
   git commit -m "feat: your concise commit message"
   git push -u origin feat/your-feature-name
   ```

5. **Open a Pull Request**:
   - Provide a clear description and complete the checklist in the PR template.
   - Wait for the automated GitHub Actions CI pipeline to validate your changes.

## 🛡️ Code Guidelines
- Use pure vanilla CSS and JavaScript with modern, readable idioms.
- Maintain the obsidian glassmorphic aesthetic and harmonious color tokens.
- Keep external runtime dependencies at zero.
