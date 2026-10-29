# Security Specification - Loy Krathong V45

## Data Invariants
1. A Krathong can be created by any employee (public or anonymous/authenticated session).
2. Krathongs contain nickname (max 100 chars), wish (max 1000 chars), valid style/color enum, decorations map, timestamp, xPercent, speed, and likes count (>= 0).
3. Any employee can view krathongs floating in the river.
4. Any employee can increment the `likes` count on a krathong.

## Dirty Dozen Security Tests
1. Unauthenticated / anonymous injection of non-whitelisted fields (e.g. `isAdmin: true`).
2. Excessive string length injection in `nickname` (> 100 chars).
3. Excessive string length injection in `wish` (> 1000 chars).
4. Invalid enum values for `style` or `color`.
5. Non-numeric or negative `likes` field initialization.
6. Deleting existing Krathong documents.
7. Updating immutable fields like `nickname`, `wish`, `style`, `color`, `timestamp`.
8. Overwriting whole Krathong document with invalid schema on update.
9. Invalid document ID containing malicious characters.
10. Attempting to set negative likes.
11. Attempting bulk deletion / list manipulation attacks.
12. Attempting to overwrite existing Krathong with missing required fields.
