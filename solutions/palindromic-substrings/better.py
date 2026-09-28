class Solution:
    def countSubstrings(self, s: str) -> int:
        n = len(s)
        pal = [[False] * n for _ in range(n)]
        count = 0
        for length in range(1, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                pal[i][j] = s[i] == s[j] and (length <= 2 or pal[i + 1][j - 1])
                count += pal[i][j]
        return count
