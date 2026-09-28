from collections import deque

class Solution:
    def maxDistance(self, grid: List[List[int]]) -> int:
        n = len(grid)
        q = deque((r, c) for r in range(n) for c in range(n) if grid[r][c])   # all land at distance 0
        if not q or len(q) == n * n:
            return -1
        d = [[0 if x else -1 for x in row] for row in grid]
        best = 0
        while q:
            r, c = q.popleft()
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < n and 0 <= nc < n and d[nr][nc] == -1:
                    d[nr][nc] = d[r][c] + 1
                    best = d[nr][nc]            # last assigned = farthest
                    q.append((nr, nc))
        return best
