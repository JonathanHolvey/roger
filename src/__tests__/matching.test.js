'use strict'

const matching = require('../matching')
const git = require('../git')

jest.mock('../git')

beforeEach(() => {
  git.getRefType.mockClear()
})

// Tests for bulder.checkNameRules()

test('checkNameRules for empty settings returns true', () => {
  const settings = null
  return expect(matching.checkNameRules(settings, 'master'))
    .resolves.toBe(true)
})

test('checkNameRules for empty match settings returns true', () => {
  const settings = {}
  return expect(matching.checkNameRules(settings, 'master'))
    .resolves.toBe(true)
})

test('checkNameRules for matching branch name returns true', () => {
  const settings = {
    matching: { branches: ['master'] },
  }
  return expect(matching.checkNameRules(settings, 'master'))
    .resolves.toBe(true)
})

test('checkNameRules for matching tag returns true', () => {
  const settings = {
    matching: { tags: true },
  }
  git.getRefType.mockResolvedValue('tag')
  return expect(matching.checkNameRules(settings, '1.0.0'))
    .resolves.toBe(true)
})

test('checkNameRules for matching pattern returns true', () => {
  const settings = {
    matching: { patterns: ['^\\d+\\.\\d+\\.\\d+$']}
  }
  return expect(matching.checkNameRules(settings, '1.0.0'))
    .resolves.toBe(true)
})

test('checkNameRules for non-matching branch name returns false', () => {
  const settings = {
    matching: { branches: ['master'] },
  }
  return expect(matching.checkNameRules(settings, 'develop'))
    .resolves.toBe(false)
})

test('checkNameRules for non-matching tag returns false', () => {
  const settings = {
    matching: { tags: true },
  }
  git.getRefType.mockResolvedValue('branch')
  return expect(matching.checkNameRules(settings, '1.0.0'))
    .resolves.toBe(false)
})

test('checkNameRules for non-matching pattern returns false', () => {
  const settings = {
    matching: { patterns: ['^\\d+\\.\\d+\\.\\d+$']}
  }
  return expect(matching.checkNameRules(settings, '1.0.0-beta'))
    .resolves.toBe(false)
})

test('checkNameRules for non-matching settings returns false', () => {
  const settings = {
    matching: {
      branches: ['master'],
      patterns: ['^\\d+\\.\\d+\\.\\d+$'],
      tags: false,
    },
  }
  git.getRefType.mockResolvedValue('tag')
  return expect(matching.checkNameRules(settings, '1.0.0-beta'))
    .resolves.toBe(false)
})
