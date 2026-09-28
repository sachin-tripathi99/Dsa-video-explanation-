class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        def ways(i, j):
            if j == len(t):
                return 1                        # all of t matched
            if i == len(s):
                return 0
            res = ways(i + 1, j)                # skip s[i]
            if s[i] == t[j]:
                res += ways(i + 1, j + 1)       # use it
            return res
        return ways(0, 0)
