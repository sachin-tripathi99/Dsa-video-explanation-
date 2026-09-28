import sys
from functools import cache

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        sys.setrecursionlimit(10000)

        @cache                                  # each amount solved once
        def fewest(a):
            if a == 0:
                return 0
            return min((fewest(a - c) + 1 for c in coins if c <= a), default=float("inf"))

        r = fewest(amount)
        return -1 if r == float("inf") else r
