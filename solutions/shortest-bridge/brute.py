class Solution:
    def shortestBridge(self, grid: List[List[int]]) -> int:
        n = len(grid)
        label = [[0] * n for _ in range(n)]

        def fill(r, c, k):
            if r < 0 or c < 0 or r >= n or c >= n or grid[r][c] != 1 or label[r][c]:
                return
            label[r][c] = k
            fill(r + 1, c, k); fill(r - 1, c, k); fill(r, c + 1, k); fill(r, c - 1, k)

        k = 0
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 1 and not label[r][c]:
                    k += 1
                    fill(r, c, k)
        a = [(r, c) for r in range(n) for c in range(n) if label[r][c] == 1]
        b = [(r, c) for r in range(n) for c in range(n) if label[r][c] == 2]
        return min(abs(r1 - r2) + abs(c1 - c2) - 1 for r1, c1 in a for r2, c2 in b)   # every pair
