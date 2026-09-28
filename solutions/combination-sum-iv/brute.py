class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        if target == 0:
            return 1
        return sum(self.combinationSum4(nums, target - x) for x in nums if x <= target)   # x is last
