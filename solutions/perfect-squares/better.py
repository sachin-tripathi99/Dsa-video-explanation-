import sys
from functools import cache

class Solution:
    def numSquares(self, n: int) -> int:
        sys.setrecursionlimit(10000)

        @cache                                  # each amount solved once
        def fewest(k):
            if k == 0:
                return 0
            return min(1 + fewest(k - s * s) for s in range(1, int(k ** 0.5) + 1))

        return fewest(n)
