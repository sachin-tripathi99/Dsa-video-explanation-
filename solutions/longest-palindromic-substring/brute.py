class Solution:
    def longestPalindrome(self, s: str) -> str:
        best = s[0]
        for i in range(len(s)):
            for j in range(i + len(best), len(s)):      # every longer substring
                t = s[i:j + 1]
                if t == t[::-1]:
                    best = t
        return best
