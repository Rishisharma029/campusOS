# Contributing to CampusOS ERP

Thank you for your interest in improving CampusOS ERP! We welcome contributions to help resolve bugs, enhance UI aesthetics, and expand backend capabilities.

---

## 1. Code of Conduct

Please maintain professional, respectful, and constructive communication in all issues, pull requests, and discussions.

---

## 2. Bug Reports & Feature Requests

### Reporting Bugs
If you find a bug, please check the existing issues before opening a new one. When submitting a bug report, include:
1. **Steps to Reproduce**: Detailed steps showing how to trigger the bug.
2. **Expected Behavior**: What you expected to happen.
3. **Screenshots/Logs**: Any console outputs, traceback logs, or UI screenshots.
4. **Environment Details**: OS, Python/Node versions, and browser specs.

### Reporting Vulnerabilities
> [!IMPORTANT]
> If you find a security vulnerability, do **not** file a public issue. Follow the private reporting steps outlined in [SECURITY.md](file:///SECURITY.md).

---

## 3. Pull Request Guidelines

1. **Fork the Repository**: Create a personal fork and work on a feature branch (e.g. `feature/my-new-feature` or `bugfix/issue-id`).
2. **Respect the License**: All code contributions must comply with our proprietary [LICENSE](file:///LICENSE) and belong to Rishi Sharma.
3. **Maintain Linting Standards**:
   - Backend Python code must pass Ruff style guidelines (`ruff check app/`).
   - Frontend TypeScript code must pass ESLint/OXLint checks (`npm run lint`).
4. **Write Tests**: Ensure any backend modifications are fully covered by integration/unit tests. Run the test suite:
   ```bash
   cd backend
   venv\Scripts\python -m pytest tests/ -v
   ```
5. **Ensure Successful Builds**: Validate that the frontend compiles cleanly before submitting:
   ```bash
   cd apps/web
   npm run build
   ```
6. **Submit PR**: Provide a descriptive summary of your changes, referencing any open issues.
