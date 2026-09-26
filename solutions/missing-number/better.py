class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        seen = set(nums)
        x = 0
        while x in seen:
            x += 1
        return x
