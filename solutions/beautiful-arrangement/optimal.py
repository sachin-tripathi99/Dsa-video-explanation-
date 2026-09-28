class Solution:
    def countArrangement(self, n: int) -> int:
        dp = [0] * (1 << n)
        dp[0] = 1
        for mask in range(1, 1 << n):
            pos = bin(mask).count("1")          # the position being filled
            for i in range(n):
                if mask >> i & 1 and ((i + 1) % pos == 0 or pos % (i + 1) == 0):
                    dp[mask] += dp[mask ^ (1 << i)]   # number i+1 sits at pos
        return dp[-1]
