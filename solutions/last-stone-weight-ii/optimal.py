class Solution:
    def lastStoneWeightII(self, stones: List[int]) -> int:
        total = sum(stones)
        half = total // 2
        dp = [True] + [False] * half            # dp[s]: a group can weigh s
        for x in stones:
            for c in range(half, x - 1, -1):
                dp[c] = dp[c] or dp[c - x]
        best = max(s for s in range(half + 1) if dp[s])   # closest to half
        return total - 2 * best
