from functools import cache

class Solution:
    def minFallingPathSum(self, matrix: List[List[int]]) -> int:
        n = len(matrix)

        @cache                                  # each cell solved once
        def fall(r, c):
            if c < 0 or c >= n:
                return float("inf")
            if r == n - 1:
                return matrix[r][c]
            return matrix[r][c] + min(fall(r + 1, c - 1), fall(r + 1, c), fall(r + 1, c + 1))

        return min(fall(0, c) for c in range(n))
