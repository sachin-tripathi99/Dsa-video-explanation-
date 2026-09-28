from functools import cache

class Solution:
    def tribonacci(self, n: int) -> int:
        @cache                                  # each T(k) once
        def t(k):
            if k == 0:
                return 0
            if k <= 2:
                return 1
            return t(k - 1) + t(k - 2) + t(k - 3)
        return t(n)
