---
description: Write tests - unit, integration, E2E
auto_execution_mode: 3
---

# Write Tests Workflow

## Step 1: Define Test Scope

- [ ] Unit tests (functions, classes)
- [ ] Integration tests (APIs, DB)
- [ ] E2E tests (user flows)
- [ ] Component tests (UI)

## Step 2: Analyze Target Code

- Read code to test
- Identify inputs, outputs, side effects
- List edge cases and error scenarios

## Step 3: Unit Test Template

```typescript
describe('[ModuleName]', () => {
  describe('[FunctionName]', () => {
    // Happy path
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      const input = ...;
      
      // Act
      const result = functionName(input);
      
      // Assert
      expect(result).toBe(expected);
    });
    
    // Edge cases
    it('should handle empty input', () => {});
    it('should handle null/undefined', () => {});
    it('should handle boundary values', () => {});
    
    // Error cases
    it('should throw error when [condition]', () => {
      expect(() => functionName(badInput)).toThrow();
    });
  });
});
```

## Step 4: Integration Test Template

```typescript
describe('[API Endpoint]', () => {
  beforeAll(async () => {
    // Setup: DB, mocks
  });

  afterAll(async () => {
    // Cleanup
  });

  it('should return 200 with valid request', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send(validPayload);
    
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expected);
  });

  it('should return 400 with invalid request', async () => {});
  it('should return 401 without auth', async () => {});
  it('should return 404 for non-existent resource', async () => {});
});
```

## Step 5: E2E Test Template

```typescript
describe('User Flow: [Flow Name]', () => {
  beforeEach(async () => {
    await page.goto('/');
  });

  it('should complete [flow] successfully', async () => {
    // Step 1: Navigate
    await page.click('[data-testid="button"]');
    
    // Step 2: Fill form
    await page.fill('[name="email"]', 'test@example.com');
    
    // Step 3: Submit
    await page.click('[type="submit"]');
    
    // Step 4: Verify
    await expect(page.locator('.success')).toBeVisible();
  });
});
```

## Step 6: Coverage Check

```bash
# Run with coverage
npm run test:coverage

# Target coverage
# - Unit: ≥80%
# - Integration: ≥70%
# - Critical paths: 100%
```

## Test Checklist
- [ ] Tests are independent (no shared state)
- [ ] Tests are deterministic (no flakiness)
- [ ] Tests are fast (mock external services)
- [ ] Tests have clear names
- [ ] Both success and failure cases covered
