from functools import cache

class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        @cache                                  # each position solved once
        def best(r, c):
            if r == len(triangle) - 1:
                return triangle[r][c]
            return triangle[r][c] + min(best(r + 1, c), best(r + 1, c + 1))
        return best(0, 0)
