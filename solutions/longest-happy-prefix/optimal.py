class Solution:
    def longestPrefix(self, s: str) -> str:
        lps, length = [0] * len(s), 0
        for i in range(1, len(s)):
            while length and s[i] != s[length]:
                length = lps[length - 1]        # fall back to a shorter border
            if s[i] == s[length]:
                length += 1
            lps[i] = length
        return s[:lps[-1]]
