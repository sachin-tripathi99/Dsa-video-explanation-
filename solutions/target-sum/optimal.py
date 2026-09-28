class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        total = sum(nums)
        if abs(target) > total or (total + target) % 2:
            return 0
        p = (total + target) // 2               # sum of the plus group
        dp = [1] + [0] * p
        for x in nums:
            for c in range(p, x - 1, -1):       # count subsets, x used once
                dp[c] += dp[c - x]
        return dp[p]
