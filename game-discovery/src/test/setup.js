import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { expect } from 'vitest'
import { afterEach } from 'vitest'

expect.extend(matchers)
afterEach(cleanup)
