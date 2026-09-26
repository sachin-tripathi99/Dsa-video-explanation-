class Solution:
    def maxAbsoluteSum(self, nums: List[int]) -> int:
        best = 0
        for i in range(len(nums)):
            s = 0
            for j in range(i, len(nums)):
                s += nums[j]
                best = max(best, abs(s))
        return best
