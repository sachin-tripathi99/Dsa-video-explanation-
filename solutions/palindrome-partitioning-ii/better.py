import sys
from functools import cache

class Solution:
    def minCut(self, s: str) -> int:
        sys.setrecursionlimit(10000)

        @cache                                  # each suffix once
        def cuts(i):
            rest = s[i:]
            if rest == rest[::-1]:
                return 0
            return min(1 + cuts(j + 1) for j in range(i, len(s) - 1) if s[i:j + 1] == s[i:j + 1][::-1])

        return cuts(0)
