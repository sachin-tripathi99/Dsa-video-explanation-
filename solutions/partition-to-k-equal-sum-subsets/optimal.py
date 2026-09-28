class Solution:
    def canPartitionKSubsets(self, nums: List[int], k: int) -> bool:
        total, n = sum(nums), len(nums)
        if total % k:
            return False
        target = total // k
        dp = [-1] * (1 << n)                    # fill of the current group, −1 = impossible
        dp[0] = 0
        for mask in range(1 << n):
            if dp[mask] < 0:
                continue
            for i in range(n):
                nm = mask | 1 << i
                if nm != mask and dp[nm] < 0 and dp[mask] + nums[i] <= target:
                    dp[nm] = (dp[mask] + nums[i]) % target   # a full group resets to 0
        return dp[-1] == 0
