class Solution:
    def numEnclaves(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])

        def sink(r, c):
            if r < 0 or c < 0 or r >= m or c >= n or grid[r][c] != 1:
                return
            grid[r][c] = 0
            sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)

        for r in range(m):                      # border land
            sink(r, 0)
            sink(r, n - 1)
        for c in range(n):
            sink(0, c)
            sink(m - 1, c)
        return sum(map(sum, grid))              # trapped land
