class Solution:
    def numDecodings(self, s: str) -> int:
        def count(i):                           # ways to decode s[i:]
            if i == len(s):
                return 1
            if s[i] == "0":
                return 0                        # no letter starts with 0
            ways = count(i + 1)
            if i + 1 < len(s) and int(s[i:i + 2]) <= 26:
                ways += count(i + 2)
            return ways
        return count(0)
