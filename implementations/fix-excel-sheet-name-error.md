# Implementation Plan - Fix Excel Sheet Name Error

The `exportToExcel` function currently fails when sheet names contain characters forbidden by Excel (e.g., `*`, `:`, `\`, `/`, `?`, `[`, `]`). We need to sanitize these sheet names to ensure compatibility with Excel.

## Proposed Changes

### 1. Update `src/utils/index.ts`

- Implement a `sanitizeSheetName` helper function that:
  - Replaces forbidden characters (`:`, `\`, `/`, `?`, `*`, `[`, `]`) with a safe character (e.g., an underscore `_` or a space).
  - Truncates the sheet name to 31 characters (Excel's maximum limit).
  - Ensures the sheet name is not empty after sanitization.
- Update `exportToExcel` to use this helper when appending sheets to the workbook.
- Handle potential duplicate sheet names that might arise after sanitization (e.g., if two sheets differ only by forbidden characters).

## Verification Plan

### Automated Tests

- Since there are no existing tests for utils, I will manually verify by triggering an export with the problematic data provided by the user.

### Manual Verification

- Test with the user's provided data: `*VIP包廂*`, `1號打擊區`, `儲值紀錄`.
- Verify that `*VIP包廂*` becomes `_VIP包廂_` or similar and the file exports successfully.
- Test with other forbidden characters: `Sheet/Name`, `Sheet:Name`, `Sheet?Name`.
- Test with a very long sheet name (> 31 characters).
