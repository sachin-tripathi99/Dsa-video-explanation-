from collections import deque

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        q = deque((r, c) for r in range(m) for c in range(n) if grid[r][c] == 2)   # every source at minute 0
        fresh = sum(row.count(1) for row in grid)
        minutes = 0
        while q and fresh:
            for _ in range(len(q)):             # one ring = one minute
                r, c = q.popleft()
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        q.append((nr, nc))
            minutes += 1
        return minutes if fresh == 0 else -1
