class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        def lcs(i, j):
            if i == 0 or j == 0:
                return 0
            if text1[i - 1] == text2[j - 1]:
                return 1 + lcs(i - 1, j - 1)    # use both
            return max(lcs(i - 1, j), lcs(i, j - 1))   # drop one
        return lcs(len(text1), len(text2))
