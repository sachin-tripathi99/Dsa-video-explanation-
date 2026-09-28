class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        n = len(grid[0])
        row = [0] + [float("inf")] * (n - 1)
        for g in grid:
            for c in range(n):
                row[c] = g[c] + (min(row[c], row[c - 1]) if c else row[c])   # min(up, left)
        return row[-1]
