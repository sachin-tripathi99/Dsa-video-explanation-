class Solution:
    def islandPerimeter(self, grid: List[List[int]]) -> int:
        land = shared = 0
        m, n = len(grid), len(grid[0])
        for r in range(m):
            for c in range(n):
                if grid[r][c]:
                    land += 1
                    shared += (r + 1 < m and grid[r + 1][c] == 1) + (c + 1 < n and grid[r][c + 1] == 1)   # down, right
        return 4 * land - 2 * shared
