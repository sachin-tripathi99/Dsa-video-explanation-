class Solution:
    def islandPerimeter(self, grid: List[List[int]]) -> int:
        m, n, p = len(grid), len(grid[0]), 0
        for r in range(m):
            for c in range(n):
                if grid[r][c]:
                    for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                        if not (0 <= nr < m and 0 <= nc < n) or grid[nr][nc] == 0:
                            p += 1              # exposed side
        return p
