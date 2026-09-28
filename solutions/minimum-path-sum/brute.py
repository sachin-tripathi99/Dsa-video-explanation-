class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        def best(r, c):
            if r < 0 or c < 0:
                return float("inf")             # off-grid
            if r == 0 and c == 0:
                return grid[0][0]
            return grid[r][c] + min(best(r - 1, c), best(r, c - 1))
        return best(len(grid) - 1, len(grid[0]) - 1)
