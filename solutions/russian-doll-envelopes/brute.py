class Solution:
    def maxEnvelopes(self, envelopes: List[List[int]]) -> int:
        env = sorted(envelopes)
        dp = [1] * len(env)                     # most envelopes ending with i outermost
        for i in range(len(env)):
            for j in range(i):
                if env[j][0] < env[i][0] and env[j][1] < env[i][1]:
                    dp[i] = max(dp[i], dp[j] + 1)
        return max(dp)
