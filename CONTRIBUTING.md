# Contributing to TopZone

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/luminariadev/topzone.git`
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`

## 📝 Code Guidelines

- **TypeScript**: Use strict types. No `any` without justification.
- **Astro**: Prefer `.astro` components. Use TypeScript in frontmatter.
- **Styling**: Tailwind CSS v4 with neubrutalism theme tokens.
- **Tests**: Run `npm test` before committing. Maintain 70%+ coverage.

## 📦 Commit Convention

```
<type>(<scope>): <description>

feat:    New feature
fix:     Bug fix
refactor: Code change without feature/fix
test:    Adding or updating tests
docs:    Documentation only
chore:   Build/config/tooling
style:   Formatting, no code change
perf:    Performance improvement

Examples:
feat(auth): add OAuth login buttons
fix(cart): resolve quantity update bug
test(helpers): add sanitizeHtml test cases
```

## 🔄 PR Process

1. Create a feature branch from `main`: `git checkout -b feature/your-feature`
2. Make your changes with atomic commits
3. Run tests: `npm test`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request against `main`

## 🐛 Reporting Issues

Include: steps to reproduce, expected vs actual behavior, screenshots if visual.
