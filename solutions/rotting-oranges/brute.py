class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        m, n, minutes = len(grid), len(grid[0]), 0
        while True:
            to_rot = [(r, c) for r in range(m) for c in range(n) if grid[r][c] == 1 and any(
                0 <= r + dr < m and 0 <= c + dc < n and grid[r + dr][c + dc] == 2
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))]   # full scan every minute
            if not to_rot:
                break
            for r, c in to_rot:
                grid[r][c] = 2
            minutes += 1
        return -1 if any(1 in row for row in grid) else minutes
