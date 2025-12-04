# Contributing to RetroWeb

Thank you for your interest in contributing to RetroWeb! This project celebrates the creative spirit of the early web, and we welcome contributions that align with that vision.

## Code of Conduct

- Be respectful and inclusive
- Embrace the retro aesthetic and spirit
- Have fun and be creative!

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/retroweb/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Suggesting Features

1. Check existing issues and discussions
2. Create a new issue with the `enhancement` label
3. Describe the feature and why it would be valuable
4. Consider how it fits the retro aesthetic

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   # For extension
   npm test
   npm run build
   
   # For builder
   cd retroweb-builder
   npm run build
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: description of what you added"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Guidelines

### Code Style

- **TypeScript**: Use strict mode, no `any` types
- **React**: Functional components with hooks
- **CSS**: Follow existing retro styling patterns
- **Comments**: Explain "why", not "what"

### Project Structure

- Extension code in `/src`
- Builder code in `/retroweb-builder/src`
- Shared types and utilities appropriately organized
- Tests alongside source files

### Kiro Specs

If you're using Kiro IDE:
- Update specs in `.kiro/specs/` when adding features
- Reference steering docs in `.kiro/steering/`
- Keep documentation in `.kiro/docs/`

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test in multiple browsers if possible

### Documentation

- Update README.md for major changes
- Add JSDoc comments for public APIs
- Update relevant docs in `.kiro/docs/`

## Retro Aesthetic Guidelines

When contributing visual elements:

- **Embrace the chaos**: The 90s web was wonderfully messy
- **Authentic assets**: Use period-appropriate GIFs and graphics
- **Bold colors**: Don't be afraid of neon and clashing colors
- **Playful fonts**: Comic Sans, Impact, and other retro fonts
- **Animated elements**: Marquees, blinking text, spinning logos
- **Visitor counters**: Because every site needs one

## Questions?

Feel free to:
- Open an issue for discussion
- Reach out to maintainers
- Check existing documentation

## Recognition

Contributors will be recognized in:
- README.md acknowledgments
- Release notes
- Project documentation

Thank you for helping bring the retro web back to life! 🌟
