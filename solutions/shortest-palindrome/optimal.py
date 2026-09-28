class Solution:
    def shortestPalindrome(self, s: str) -> str:
        rev = s[::-1]
        c = s + "#" + rev                       # '#' keeps borders within s
        lps, length = [0] * len(c), 0
        for i in range(1, len(c)):
            while length and c[i] != c[length]:
                length = lps[length - 1]
            if c[i] == c[length]:
                length += 1
            lps[i] = length
        l = lps[-1]                             # longest palindromic prefix
        return rev[:len(s) - l] + s
