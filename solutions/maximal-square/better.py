from functools import cache

class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        @cache                                  # largest square ending at (r, c)
        def side(r, c):
            if r < 0 or c < 0 or matrix[r][c] != "1":
                return 0
            return 1 + min(side(r - 1, c), side(r, c - 1), side(r - 1, c - 1))

        best = max(side(r, c) for r in range(len(matrix)) for c in range(len(matrix[0])))
        return best * best
