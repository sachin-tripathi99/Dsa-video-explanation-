class Solution:
    def shortestPalindrome(self, s: str) -> str:
        for k in range(len(s), 0, -1):
            p = s[:k]
            if p == p[::-1]:                    # longest palindromic prefix
                return s[k:][::-1] + s
        return s
