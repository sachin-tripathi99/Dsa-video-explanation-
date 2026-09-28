class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False

        def can(i, remaining):
            if remaining == 0:
                return True
            if i == len(nums) or remaining < 0:
                return False
            return can(i + 1, remaining) or can(i + 1, remaining - nums[i])   # skip or take

        return can(0, total // 2)
