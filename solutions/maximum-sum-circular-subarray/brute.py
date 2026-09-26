class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        n = len(nums)
        best = nums[0]
        for start in range(n):
            s = 0
            for length in range(1, n + 1):
                s += nums[(start + length - 1) % n]
                best = max(best, s)
        return best
