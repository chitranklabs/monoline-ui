# Security Policy

## Supported Versions

We support only the latest published version of `@chitrank2050/monoline-ui`. Please ensure you are always running the latest release from npm.

| Version | Supported |
| :------ | :-------: |
| v0.1.x  |    ✅     |
| < v0.1  |    ❌     |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, use one of the following:

1. **GitHub Private Vulnerability Reporting** — use the "Report a vulnerability" button in the [Security tab](https://github.com/chitranklabs/monoline-ui/security/advisories/new) of this repository.
2. **Email** — contact the maintainer directly at `chitrank2050@gmail.com`.

### Our Process

1. **Acknowledgment** — we will acknowledge your report within 48 hours.
2. **Investigation** — we will assess the severity and scope of the issue.
3. **Fix & Disclosure** — once a fix is ready, we will coordinate a responsible public disclosure with you.
4. **Credit** — we are happy to credit you in our security advisories and changelog.

## Security Practices

Monoline UI is built with a security-conscious supply chain:

- **Secret Scanning**: Gitleaks is integrated into local hooks and CI to prevent credential leaks.
- **Workflow Auditing**: Zizmor static analysis ensures GitHub Actions follow security best practices.
- **SHA Pinning**: All GitHub Actions are pinned to full commit SHAs — no floating `@main` references.
- **Dependency Auditing**: Automated `pnpm audit` on every PR.
- **Minimal Surface**: Only two runtime dependencies (`@radix-ui/react-slot`, `clsx` + `tailwind-merge`).

Thank you for helping keep Monoline UI secure. 🛡️✨
