class Solution:
    def canJump(self, nums: List[int]) -> bool:
        reach = 0
        for i, x in enumerate(nums):
            if i > reach:
                return False                    # stuck before i
            reach = max(reach, i + x)
        return True
