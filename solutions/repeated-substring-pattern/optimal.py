class Solution:
    def repeatedSubstringPattern(self, s: str) -> bool:
        n = len(s)
        lps, length = [0] * n, 0
        for i in range(1, n):
            while length and s[i] != s[length]:
                length = lps[length - 1]        # fall back to a shorter border
            if s[i] == s[length]:
                length += 1
            lps[i] = length
        l = lps[-1]
        p = n - l                               # the period
        return l > 0 and n % p == 0
