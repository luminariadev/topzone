module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-empty': [0, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',     # New feature
        'fix',      # Bug fix
        'perf',     # Performance improvement
        'refactor', # Code refactoring
        'style',    # Code style change (formatting, no logic change)
        'test',     # Adding or updating tests
        'build',    # Build system or dependency change
        'ci',       # CI/CD change
        'chore',    # Maintenance task
        'docs',     # Documentation change
        'security', # Security fix
      ],
    ],
  },
};