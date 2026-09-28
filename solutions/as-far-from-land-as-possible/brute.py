class Solution:
    def maxDistance(self, grid: List[List[int]]) -> int:
        n = len(grid)
        land = [(r, c) for r in range(n) for c in range(n) if grid[r][c]]
        if not land or len(land) == n * n:
            return -1
        return max(min(abs(r - lr) + abs(c - lc) for lr, lc in land)   # every pair
                   for r in range(n) for c in range(n) if not grid[r][c])
