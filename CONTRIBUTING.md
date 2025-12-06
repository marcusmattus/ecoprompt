# Contributing to EcoPrompt

First off, thank you for considering contributing to EcoPrompt! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other applications**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests
3. Ensure the test suite passes
4. Make sure your code follows the Soft Brutalism design guidelines
5. Write a clear commit message

## Design Guidelines

### Soft Brutalism Principles

- Use bold, vibrant colors (#00E599, #FFD93D, #FF6BCB)
- Apply thick 4px black borders
- Use rounded corners (16-32px)
- Add hard shadows (no blur)
- Keep high contrast
- Make it playful and friendly

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS utility classes
- Keep components small and focused
- Write clear comments for complex logic

### Component Structure

```jsx
// Component name and purpose
const MyComponent = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Handlers
  const handleClick = () => {
    // ...
  };
  
  // Render
  return (
    <BaseCard>
      {/* JSX */}
    </BaseCard>
  );
};
```

## Development Process

1. **Clone the repo**
   ```bash
   git clone https://github.com/marcusmattus/ecoprompt.git
   cd ecoprompt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

5. **Test your changes**
   ```bash
   npm run dev      # Test locally
   npm run build    # Ensure it builds
   ```

6. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **Open a Pull Request**

## Project Structure

```
ecoprompt/
├── src/
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom hooks
│   ├── plugins/        # AI provider plugins
│   ├── lib/            # Utilities
│   └── main.jsx        # Entry point
├── public/             # Static assets
└── docs/               # Documentation
```

## Adding New Features

### Adding a New AI Provider Plugin

1. Create plugin file in `src/plugins/`
2. Implement the plugin interface
3. Register in `src/plugins/index.js`
4. Add documentation
5. Add tests

### Adding a New Component

1. Follow Soft Brutalism design
2. Make it reusable
3. Add PropTypes or TypeScript types
4. Document props and usage
5. Add to component library

## Testing

```bash
# Run tests (when available)
npm test

# Run linter
npm run lint

# Check types
npm run type-check
```

## Documentation

- Update README.md if needed
- Add JSDoc comments to functions
- Update relevant documentation files
- Include examples

## Questions?

- Open an issue with the `question` label
- Join our Discord (coming soon)
- Email: support@ecoprompt.com (coming soon)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to EcoPrompt! 💚🌍
