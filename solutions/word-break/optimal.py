class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)
        longest = max(map(len, wordDict))
        n = len(s)
        dp = [True] + [False] * n               # dp[i]: first i chars can be split
        for i in range(1, n + 1):
            for j in range(i - 1, max(0, i - longest) - 1, -1):
                if dp[j] and s[j:i] in words:
                    dp[i] = True
                    break
        return dp[n]
