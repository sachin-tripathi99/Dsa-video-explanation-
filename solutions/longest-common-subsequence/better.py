import sys
from functools import cache

class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        sys.setrecursionlimit(10000)

        @cache                                  # each pair of prefixes once
        def lcs(i, j):
            if i == 0 or j == 0:
                return 0
            if text1[i - 1] == text2[j - 1]:
                return 1 + lcs(i - 1, j - 1)
            return max(lcs(i - 1, j), lcs(i, j - 1))

        return lcs(len(text1), len(text2))
