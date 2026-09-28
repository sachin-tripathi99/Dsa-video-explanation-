from functools import cache

class Solution:
    def climbStairs(self, n: int) -> int:
        @cache                                  # each n solved once
        def ways(k):
            return 1 if k <= 1 else ways(k - 1) + ways(k - 2)
        return ways(n)
