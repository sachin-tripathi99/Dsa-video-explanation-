class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])

        def measure(r, c, seen):
            if r < 0 or c < 0 or r >= m or c >= n or grid[r][c] != 1 or (r, c) in seen:
                return 0
            seen.add((r, c))
            return 1 + measure(r + 1, c, seen) + measure(r - 1, c, seen) + measure(r, c + 1, seen) + measure(r, c - 1, seen)

        return max((measure(r, c, set()) for r in range(m) for c in range(n) if grid[r][c] == 1), default=0)   # fresh visited each time
