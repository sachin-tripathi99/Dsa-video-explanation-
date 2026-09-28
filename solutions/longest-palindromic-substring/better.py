class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)
        pal = [[False] * n for _ in range(n)]
        bi = bj = 0
        for length in range(1, n + 1):          # short ranges first
            for i in range(n - length + 1):
                j = i + length - 1
                pal[i][j] = s[i] == s[j] and (length <= 2 or pal[i + 1][j - 1])
                if pal[i][j] and length > bj - bi + 1:
                    bi, bj = i, j
        return s[bi:bj + 1]
