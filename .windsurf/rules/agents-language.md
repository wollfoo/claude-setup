---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
---

# Language Programming Experts

Select language via user request or file extension.

---

## Go (golang)
**Focus**: Goroutines, channels, interfaces, composition
**Standards**: Effective Go, simplicity-first, explicit error handling
**Testing**: Table-driven tests, benchmarks, go test
**Approach**:
1. Simplicity first - clear > clever
2. Composition via interfaces
3. Explicit error handling, no magic
4. Concurrent by design, safe by default
5. Benchmark before optimizing

**Output**: Idiomatic Go, wrapped errors, go.mod setup, minimal deps

---

## Python
**Focus**: Decorators, async/await, type hints, metaclasses
**Standards**: PEP 8, pytest, mypy/ruff, Black
**Testing**: 90%+ coverage, fixtures, mocking
**Approach**:
1. Pythonic code - follow PEP 8
2. Composition over inheritance
3. Generators for memory efficiency
4. Custom exceptions for error handling
5. Type hints everywhere

**Output**: Clean code, docstrings, profiling when needed

---

## Rust
**Focus**: Ownership, lifetimes, traits, async (Tokio)
**Standards**: Safety-first, zero-cost abstractions, clippy
**Testing**: criterion.rs benchmarks, doctests
**Approach**:
1. Leverage type system for compile-time guarantees
2. Iterator chains over manual loops
3. Result<T, E> for errors, avoid unwrap()
4. Newtype and builder patterns
5. Document unsafe blocks

**Output**: Memory-safe code, minimal Cargo.toml deps

---

## Ruby
**Focus**: Sandi Metz rules, SOLID, service objects
**Standards**: 100 lines/class, 5 lines/method, RSpec
**Testing**: FactoryBot, 90%+ coverage, shared examples
**Approach**:
1. Clarity over cleverness
2. Small objects, single responsibility
3. Tell don't ask, minimize Law of Demeter violations
4. Fail fast with meaningful errors
5. Test behavior, not implementation

**Output**: Idiomatic Ruby, custom exceptions, semantic naming

---

## PHP
**Focus**: PSR standards, SOLID, DI, design patterns
**Standards**: Strict types, PHPStan/Psalm, PHP CS Fixer
**Testing**: PHPUnit 80%+ coverage
**Approach**:
1. Type-safe with strict typing
2. Appropriate design patterns per use case
3. PSR standards for style/autoloading
4. Composition over inheritance
5. Dependency injection for loose coupling

**Output**: Clean architecture, documented patterns

---

## TypeScript
**Focus**: Advanced types, generics, strict mode, discriminated unions
**Standards**: ESLint, Prettier, branded types
**Testing**: Comprehensive type coverage
**Approach**:
1. Enable strict: true
2. Prefer interfaces for object shapes
3. Use const assertions, readonly modifiers
4. Branded types for domain modeling
5. Avoid any; use unknown with type guards

**Output**: Type-safe code, minimal runtime overhead, JSDoc comments

---

## Blockchain (Solidity)
**Focus**: Smart contracts, DeFi, security, gas optimization
**Standards**: OpenZeppelin, Checks-Effects-Interactions
**Testing**: Hardhat/Foundry, comprehensive edge cases
**Approach**:
1. Security-first - assume all inputs malicious
2. Reentrancy guards on external calls
3. Integer overflow protection
4. Access control with role-based permissions
5. Gas optimization without sacrificing security

**Output**: Secure contracts, audit checklist, deployment scripts

---

## Game Development
**Focus**: Unity/Unreal/Godot, mechanics, physics, AI
**Standards**: Component-based (ECS), 60+ FPS
**Testing**: Gameplay testing, performance profiling
**Approach**:
1. Prototype mechanics quickly
2. Component-based architecture
3. Object pooling for performance
4. Design for multiple input methods
5. Profile early, optimize bottlenecks

**Output**: Modular game code, profiling results, input handling

---

## Universal Principles
1. Prefer standard library over 3rd-party
2. Composition over inheritance
3. Explicit error handling
4. Test-first mindset
5. Profile before optimizing
6. Document public APIs
