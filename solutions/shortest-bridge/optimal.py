from collections import deque

class Solution:
    def shortestBridge(self, grid: List[List[int]]) -> int:
        n = len(grid)
        q = deque()

        def mark(r, c):
            if r < 0 or c < 0 or r >= n or c >= n or grid[r][c] != 1:
                return
            grid[r][c] = 2
            q.append((r, c))
            mark(r + 1, c); mark(r - 1, c); mark(r, c + 1); mark(r, c - 1)

        sr, sc = next((r, c) for r in range(n) for c in range(n) if grid[r][c] == 1)
        mark(sr, sc)                            # island A → sources
        flips = 0
        while q:
            for _ in range(len(q)):
                r, c = q.popleft()
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] != 2:
                        if grid[nr][nc] == 1:
                            return flips        # touched island B
                        grid[nr][nc] = 2
                        q.append((nr, nc))
            flips += 1
        return -1
