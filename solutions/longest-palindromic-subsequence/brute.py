class Solution:
    def longestPalindromeSubseq(self, s: str) -> int:
        def lps(i, j):
            if i > j:
                return 0
            if i == j:
                return 1
            if s[i] == s[j]:
                return 2 + lps(i + 1, j - 1)    # both ends join
            return max(lps(i + 1, j), lps(i, j - 1))   # drop one end
        return lps(0, len(s) - 1)
