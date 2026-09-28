from functools import cache

class Solution:
    def rob(self, nums: List[int]) -> int:
        @cache                                  # each house solved once
        def best(i):
            if i < 0:
                return 0
            return max(best(i - 1), best(i - 2) + nums[i])
        return best(len(nums) - 1)
