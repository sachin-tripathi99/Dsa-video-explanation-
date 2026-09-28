import sys
from functools import cache

class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        sys.setrecursionlimit(10000)

        @cache                                  # each (i, j) once
        def ways(i, j):
            if j == len(t):
                return 1
            if i == len(s):
                return 0
            res = ways(i + 1, j)
            if s[i] == t[j]:
                res += ways(i + 1, j + 1)
            return res

        return ways(0, 0)
