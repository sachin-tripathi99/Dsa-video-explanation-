class Solution:
    def numDecodings(self, s: str) -> int:
        prev2, prev1 = 1, 0 if s[0] == "0" else 1   # dp[i − 2], dp[i − 1]
        for i in range(2, len(s) + 1):
            cur = 0
            if s[i - 1] != "0":
                cur += prev1                    # last digit alone
            if s[i - 2] != "0" and int(s[i - 2:i]) <= 26:
                cur += prev2                    # last two digits
            prev2, prev1 = prev1, cur
        return prev1
