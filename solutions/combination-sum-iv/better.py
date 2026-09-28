from functools import cache

class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        @cache                                  # each total solved once
        def count(t):
            if t == 0:
                return 1
            return sum(count(t - x) for x in nums if x <= t)
        return count(target)
