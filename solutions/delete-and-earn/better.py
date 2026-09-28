import sys
from functools import cache

class Solution:
    def deleteAndEarn(self, nums: List[int]) -> int:
        sys.setrecursionlimit(50000)
        m = max(nums)
        pts = [0] * (m + 1)
        for x in nums:
            pts[x] += x

        @cache                                  # each value solved once
        def best(x):
            if x < 0:
                return 0
            return max(best(x - 1), best(x - 2) + pts[x])

        return best(m)
