from collections import Counter

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        return next(x for x, c in Counter(nums).items() if c == 1)
