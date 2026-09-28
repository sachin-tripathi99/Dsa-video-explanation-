class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)
        bi = bj = 0
        for c in range(2 * n - 1):              # letters and gaps
            l, r = c // 2, c // 2 + c % 2
            while l >= 0 and r < n and s[l] == s[r]:
                l, r = l - 1, r + 1
            if r - l - 2 > bj - bi:             # last matching window
                bi, bj = l + 1, r - 1
        return s[bi:bj + 1]
