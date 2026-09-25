class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        nums.sort()
        return any(nums[i] == nums[i - 1] for i in range(1, len(nums)))   # equal neighbours
