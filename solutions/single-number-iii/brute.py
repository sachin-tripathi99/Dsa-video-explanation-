from collections import Counter

class Solution:
    def singleNumber(self, nums: List[int]) -> List[int]:
        return [x for x, c in Counter(nums).items() if c == 1]
