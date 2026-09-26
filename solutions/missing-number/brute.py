class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        nums.sort()
        for i, x in enumerate(nums):
            if x != i:
                return i
        return len(nums)
