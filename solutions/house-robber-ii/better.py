from functools import cache

class Solution:
    def rob(self, nums: List[int]) -> int:
        n = len(nums)
        if n == 1:
            return nums[0]

        @cache                                  # (lo, i) solved once
        def best(lo, i):
            if i < lo:
                return 0
            return max(best(lo, i - 1), best(lo, i - 2) + nums[i])

        return max(best(0, n - 2), best(1, n - 1))
