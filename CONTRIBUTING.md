# Contributing to CampusOS AI

Thank you for your interest in contributing to **CampusOS AI**! We welcome contributions from developers, designers, and educators to expand administrative workflows, enhance UI accessibility, and strengthen student employability engines.

---

## 1. Code of Conduct

All participants in the CampusOS AI project are expected to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md). Please maintain respectful, collaborative, and inclusive communication across issues, discussions, and pull requests.

---

## 2. Getting Started

### Prerequisites
- **Python**: 3.11+ (Tested on Python 3.14)
- **Node.js**: 18+ (Tested on Node 22)
- **Git**

### Repository Setup
1. **Fork the Repository** on GitHub.
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/<your-username>/campusOS.git
   cd campusOS
   ```
3. **Set up the Backend**:
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate

   pip install -r requirements.txt
   python seed.py
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
4. **Set up the Frontend**:
   ```bash
   # In another terminal:
   cd campusOS/apps/web
   npm install
   npm run dev
   ```

---

## 3. Pull Request Guidelines

1. **Create a Topic Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
2. **Adhere to Code Quality Standards**:
   - **Backend Python**: Follow PEP 8 and Ruff conventions (`ruff check app/`).
   - **Frontend TypeScript**: Ensure zero TypeScript or build errors (`npm run build`).
3. **Run Automated Tests**:
   - **Backend Pytest**:
     ```bash
     cd backend
     python -m pytest
     ```
     Ensure all 17+ tests pass.
   - **Frontend Build**:
     ```bash
     cd apps/web
     npm run build
     ```
     Ensure the build completes with exit code `0`.
4. **Commit Conventions**:
   Use clear, semantic commit messages:
   - `feat: add automated JD skill extraction in recruiter router`
   - `fix: prevent redirect loop on login with orphaned session flag`
   - `docs: update system architecture and process flowcharts in README`
   - `test: add unit test coverage for career copilot query parsing`

---

## 4. Reporting Issues & Vulnerabilities

- **Bug Reports & Enhancements**: Open an issue on GitHub detailing the steps to reproduce, expected vs. actual behavior, and relevant logs.
- **Security Vulnerabilities**: Do **not** post security bugs to public issues. Refer to [`SECURITY.md`](./SECURITY.md) for private reporting procedures.

---

<div align="center">
  <sub>CampusOS AI • Smart India Hackathon 2026 (SIH26044)</sub>
</div>
