class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        row = [1] * n                           # first row
        for _ in range(1, m):
            for c in range(1, n):
                row[c] += row[c - 1]            # above (old) + left (new)
        return row[-1]
