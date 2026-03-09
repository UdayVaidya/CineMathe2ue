// Test environment setup — runs before every test file
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { server } from './msw/server'

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

// Reset handlers between tests (so one test's overrides don't bleed)
afterEach(() => {
    cleanup()
    server.resetHandlers()
})

// Stop server after all tests done
afterAll(() => server.close())

// ── Browser API stubs not available in jsdom

// IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation((cb) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

// scrollBy / scrollTo
Element.prototype.scrollBy = vi.fn()
Element.prototype.scrollTo = vi.fn()

// matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false, media: query,
        onchange: null,
        addListener: vi.fn(), removeListener: vi.fn(),
        addEventListener: vi.fn(), removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})
