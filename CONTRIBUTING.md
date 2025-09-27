# Contributing to SIH Railway Map Project

Thank you for your interest in contributing to the Smart India Hackathon Railway Map project!

## Project Structure

This repository follows a specific structure to maintain organization:

```
project_root/
├── railway-map-app/          # Main React application
│   ├── src/                  # Source code
│   │   ├── RailwayMap.tsx   # Main map component
│   │   ├── App.tsx          # Application root
│   │   └── ...
│   ├── public/               # Static assets and GeoJSON data
│   ├── package.json         # Application dependencies
│   └── README.md            # Application documentation
├── package.json              # Root project configuration
├── README.md                 # Project overview
└── CONTRIBUTING.md           # This file
```

## How to Contribute

### 1. Fork the Repository
- Fork the [main repository](https://github.com/Adi-Deshmukh/SIH)
- Clone your fork locally

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Follow the existing code style
- Add appropriate comments
- Update documentation if needed
- Test your changes thoroughly

### 4. Commit Your Changes
```bash
git add .
git commit -m "Add: Brief description of your changes"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### File Organization
- Keep components in the `src/` directory
- Place static assets in `public/`
- Use descriptive file names
- Group related files in subdirectories

### Testing
- Test your changes in multiple browsers
- Verify railway track highlighting works correctly
- Check for console errors
- Ensure responsive design works

## Railway Map Specific Guidelines

### GeoJSON Data
- Ensure coordinates are in [longitude, latitude] format
- Validate data before adding to the repository
- Use appropriate coordinate precision
- Document data sources

### Map Features
- Test route highlighting with different city pairs
- Verify track continuity and accuracy
- Ensure proper error handling
- Check performance with large datasets

### UI/UX
- Maintain consistent styling
- Ensure accessibility
- Test on different screen sizes
- Provide clear user feedback

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows project structure
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] Railway highlighting works correctly

### PR Description
- Clearly describe what the PR does
- Include screenshots if UI changes
- List any breaking changes
- Reference related issues

### Review Process
- PRs will be reviewed by maintainers
- Address feedback promptly
- Keep PRs focused and small
- Update PR if requested

## Getting Help

- Check existing issues first
- Create a new issue for bugs or feature requests
- Use clear, descriptive titles
- Provide steps to reproduce issues

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to the SIH Railway Map project! 🚂
