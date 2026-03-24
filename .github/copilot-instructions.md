# Coding Standards and Guidelines

## Global Project Rules

### Naming Conventions
- **Variables**: Use camelCase for all variable names (e.g., `userProfile`, `totalAmount`)
- **Functions/Methods**: Use camelCase for function and method names (e.g., `getUserData`, `calculateTotal`)
- **Classes**: Use PascalCase for class names (e.g., `UserController`, `DataService`)
- **Constants**: Use UPPER_SNAKE_CASE for constants (e.g., `MAX_RETRIES`, `API_BASE_URL`)
- **Files**: Use kebab-case for file names (e.g., `user-service.ts`, `data-controller.dart`)

### Language Requirements
- **Function Names**: ALWAYS write function names in English
- **Variable Names**: ALWAYS write variable names in English
- **Comments**: Write comments in Portuguese for business logic, English for technical implementation
- **Documentation**: API documentation and technical docs should be in English

### Code Style
- **NO Emojis**: NEVER use emojis in code, comments, commit messages, or documentation
- **Indentation**: Use 2 spaces for indentation (TypeScript/JavaScript/Dart)
- **Line Length**: Maximum 100 characters per line
- **Semicolons**: Always use semicolons in TypeScript/JavaScript
- **Quotes**: Use single quotes for strings in TypeScript/JavaScript, double quotes in Dart

### Code Quality
- **No Console Logs**: Remove all `console.` statements before committing
- **Error Handling**: Always implement proper error handling with try-catch blocks
- **Type Safety**: Always define types explicitly (TypeScript) or use strong typing (Dart)
- **Null Safety**: Handle null/undefined values appropriately
- **DRY Principle**: Don't Repeat Yourself - extract reusable code into functions

### Architecture Patterns
- **Clean Architecture**: Follow clean architecture principles (domain, application, infrastructure layers)
- **Dependency Injection**: Use dependency injection for better testability
- **Single Responsibility**: Each function/class should have a single, well-defined purpose
- **SOLID Principles**: Follow SOLID principles in all code

### Git Commit Standards
- **Commit Messages**: Use conventional commits format (e.g., `feat:`, `fix:`, `refactor:`)
- **NO Emojis**: DO NOT use emojis in commit messages
- **Language**: Write commit messages in English
- **Be Descriptive**: Commit messages should clearly explain what changed and why

### Security
- **No Hardcoded Secrets**: Never hardcode API keys, passwords, or tokens
- **Environment Variables**: Use environment variables for sensitive configuration
- **Input Validation**: Always validate user input
- **SQL Injection**: Use parameterized queries to prevent SQL injection

### Performance
- **Async/Await**: Use async/await for asynchronous operations
- **Avoid Blocking**: Don't block the main thread with heavy computations
- **Optimize Queries**: Optimize database queries and API calls
- **Lazy Loading**: Implement lazy loading where appropriate

### Documentation
- **Function Documentation**: Document all public functions with JSDoc/DartDoc
- **README Files**: Keep README files updated with current setup instructions
- **API Documentation**: Maintain up-to-date API documentation
- **Code Comments**: Write clear comments for complex business logic

### Platform-Specific Guidelines

#### TypeScript/Node.js (API)
- Use async/await instead of callbacks
- Use interfaces for type definitions
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks

#### Dart/Flutter (Mobile App)
- Follow Flutter best practices
- Use const constructors when possible
- Implement proper state management
- Use named parameters for functions with multiple arguments

##### Shimmer Loading Pattern (Flutter)
When implementing shimmer loading states in the mobile app, ALWAYS follow these rules:

1. **Preserve Structure**: Always keep the visual structure (containers, borders, colors, layout)
   - Cards, buttons, and UI elements should maintain their shape and styling
   - Background colors, borders, and decorations must remain visible
   - Layout spacing and positioning should stay consistent

2. **Shimmer Only on Data**: Apply shimmer ONLY to valuable data elements
   - Text content (names, IDs, values, labels)
   - Icons and images that are dynamic
   - Button labels and interactive text
   - Status indicators and badges
   - DO NOT shimmer on: static backgrounds, borders, spacing elements

3. **Disable Interactions**: During loading state, prevent user interactions
   - Disable buttons and taps (use `onPressed: null` or hide interactive elements)
   - Hide menus and action buttons that require data
   - Prevent navigation to detail screens