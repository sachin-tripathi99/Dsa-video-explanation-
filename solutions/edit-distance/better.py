from functools import cache

class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        @cache                                  # each pair of prefixes once
        def ed(i, j):
            if i == 0:
                return j
            if j == 0:
                return i
            if word1[i - 1] == word2[j - 1]:
                return ed(i - 1, j - 1)
            return 1 + min(ed(i - 1, j - 1), ed(i - 1, j), ed(i, j - 1))
        return ed(len(word1), len(word2))
