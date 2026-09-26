class Solution:
    def canJump(self, nums: List[int]) -> bool:
        def reach(i):
            if i >= len(nums) - 1:
                return True
            return any(reach(i + step) for step in range(1, nums[i] + 1))

        return reach(0)
