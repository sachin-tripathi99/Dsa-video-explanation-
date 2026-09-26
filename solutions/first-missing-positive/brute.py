class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        seen = set(nums)
        x = 1
        while x in seen:
            x += 1
        return x
