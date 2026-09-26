class Solution:
    def jump(self, nums: List[int]) -> int:
        n = len(nums)
        dp = [float("inf")] * n
        dp[0] = 0
        for i in range(n):
            for s in range(1, min(nums[i], n - 1 - i) + 1):
                dp[i + s] = min(dp[i + s], dp[i] + 1)
        return dp[-1]
