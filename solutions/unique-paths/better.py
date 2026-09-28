from functools import cache

class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        @cache                                  # each cell solved once
        def paths(r, c):
            if r == 0 or c == 0:
                return 1
            return paths(r - 1, c) + paths(r, c - 1)
        return paths(m - 1, n - 1)
