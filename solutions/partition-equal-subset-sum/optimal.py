class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        dp = [True] + [False] * target          # dp[s]: some subset sums to s
        for x in nums:
            for c in range(target, x - 1, -1):  # high → low: x used once
                dp[c] = dp[c] or dp[c - x]
        return dp[target]
