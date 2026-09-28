class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        def count(i, s):
            if i == len(nums):
                return 1 if s == target else 0
            return count(i + 1, s + nums[i]) + count(i + 1, s - nums[i])   # + or −
        return count(0, 0)
