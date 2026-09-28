class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        m, n = len(grid), len(grid[0])

        def sink(r, c):
            if r < 0 or c < 0 or r >= m or c >= n or grid[r][c] != "1":
                return
            grid[r][c] = "0"                    # visited = water
            sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)

        count = 0
        for r in range(m):
            for c in range(n):
                if grid[r][c] == "1":
                    count += 1                  # a new island
                    sink(r, c)
        return count
