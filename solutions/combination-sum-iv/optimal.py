class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        dp = [1] + [0] * target                 # dp[0]: the empty sequence
        for s in range(1, target + 1):          # totals outside → orders count
            dp[s] = sum(dp[s - x] for x in nums if x <= s)
        return dp[target]
