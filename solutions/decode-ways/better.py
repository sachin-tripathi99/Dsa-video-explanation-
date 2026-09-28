from functools import cache

class Solution:
    def numDecodings(self, s: str) -> int:
        @cache                                  # each suffix solved once
        def count(i):
            if i == len(s):
                return 1
            if s[i] == "0":
                return 0
            ways = count(i + 1)
            if i + 1 < len(s) and int(s[i:i + 2]) <= 26:
                ways += count(i + 2)
            return ways
        return count(0)
