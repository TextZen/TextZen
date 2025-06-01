import { test, expect } from './shared/setup'

test.describe('大文字小文字を区別する検索', () => {
  test('大文字小文字を区別しない検索がデフォルトで動作すること', async ({ page }) => {
    // Create a file with mixed case content
    await page.locator('[aria-label="New"]').click()
    await page.waitForTimeout(1000)
    await page.keyboard.insertText('Case Test Document')
    await page.locator('.cm-scroller').click()
    await page.keyboard.insertText(
      'This document contains Test, test, TEST, and TeSt variations.\n\n'
    )
    await page.keyboard.insertText('Also includes Hello, hello, HELLO variations.')
    await page.waitForTimeout(1000)

    // Perform case-insensitive search (default)
    await page.locator('[aria-label="Full Text Search"]').click()
    await page.locator('input').focus()
    await page.keyboard.insertText('test')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1000)

    // Should find all variations
    const resultCount = await page.locator('.fts-line').count()
    expect(resultCount).toBeGreaterThanOrEqual(1) // At least one line with multiple matches

    // Check that highlights include different cases
    const highlights = await page.locator('.highlight').count()
    expect(highlights).toBeGreaterThanOrEqual(4) // Test, test, TEST, TeSt
  })

  test('大文字小文字を区別する検索が動作すること', async ({ page }) => {
    // Create a file with mixed case content using unique keyword
    await page.locator('[aria-label="New"]').click()
    await page.waitForTimeout(1000)
    await page.keyboard.insertText('Unique Case Test')
    await page.locator('.cm-scroller').click()
    await page.keyboard.insertText('Line 1: UniqueWord is capitalized.\n')
    await page.keyboard.insertText('Line 2: uniqueword is lowercase.\n')
    await page.keyboard.insertText('Line 3: UNIQUEWORD is uppercase.\n')
    await page.keyboard.insertText('Line 4: UnIqUeWoRd is mixed case.')
    await page.waitForTimeout(1000)

    // Perform full text search
    await page.locator('[aria-label="Full Text Search"]').click()
    await page.locator('input').focus()

    // Enable case sensitivity first
    await page.locator('.fts-case-toggle').click()
    await page.waitForTimeout(500)

    // Then search for exact case "UniqueWord"
    await page.keyboard.insertText('UniqueWord')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1000)

    // Should only find exact match "UniqueWord"
    const resultTitle = await page.locator('.fts-title').innerText()
    expect(resultTitle).toContain('Unique Case Test')

    const highlights = await page.locator('.highlight').count()
    expect(highlights).toBe(1)

    // Verify the correct line is highlighted
    const highlightedText = await page.locator('.highlight').textContent()
    expect(highlightedText).toBe('UniqueWord')
  })

  test('大文字小文字の切り替えが即座に反映されること', async ({ page }) => {
    // Create a file with content using unique keyword
    await page.locator('[aria-label="New"]').click()
    await page.waitForTimeout(1000)
    await page.keyboard.insertText('Toggle Search Test')
    await page.locator('.cm-scroller').click()
    await page.keyboard.insertText('Found in text: CaseTerm, caseterm, CASETERM')
    await page.waitForTimeout(1000)

    // Search for "caseterm"
    await page.locator('[aria-label="Full Text Search"]').click()
    await page.locator('input').focus()
    await page.keyboard.insertText('caseterm')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1000)

    // Initially case-insensitive (should find 3 matches)
    const resultTitle = await page.locator('.fts-title').innerText()
    expect(resultTitle).toContain('Toggle Search Test')

    let highlights = await page.locator('.highlight').count()
    expect(highlights).toBe(3)

    // Toggle case sensitivity
    await page.locator('.fts-case-toggle').click()
    await page.waitForTimeout(1000)

    // Now should find only lowercase "caseterm"
    highlights = await page.locator('.highlight').count()
    expect(highlights).toBe(1)

    // Toggle back to case-insensitive
    await page.locator('.fts-case-toggle').click()
    await page.waitForTimeout(1000)

    // Should find all 3 matches again
    highlights = await page.locator('.highlight').count()
    expect(highlights).toBe(3)
  })

  test('ケーストグルボタンの視覚的フィードバックが動作すること', async ({ page }) => {
    // Open full text search
    await page.locator('[aria-label="Full Text Search"]').click()

    // Check initial state (case-insensitive)
    const toggleButton = page.locator('.fts-case-toggle')
    await expect(toggleButton).toBeVisible()

    // Initially not active
    let activeSpan = await toggleButton.locator('span.active').count()
    expect(activeSpan).toBe(0)

    // Click to enable case sensitivity
    await toggleButton.click()
    await page.waitForTimeout(500)

    // Should show active state
    activeSpan = await toggleButton.locator('span.active').count()
    expect(activeSpan).toBe(1)

    // Click again to disable
    await toggleButton.click()
    await page.waitForTimeout(500)

    // Should not show active state
    activeSpan = await toggleButton.locator('span.active').count()
    expect(activeSpan).toBe(0)
  })
})
