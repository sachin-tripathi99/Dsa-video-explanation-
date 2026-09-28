class Solution:
    def minCut(self, s: str) -> int:
        n = len(s)
        pal = [[False] * n for _ in range(n)]
        for i in range(n - 1, -1, -1):          # range table
            for j in range(i, n):
                pal[i][j] = s[i] == s[j] and (j - i < 2 or pal[i + 1][j - 1])
        cuts = [0] * n                          # cuts[j]: fewest cuts for s[0..j]
        for j in range(n):
            if pal[0][j]:
                continue                        # whole prefix: 0 cuts
            cuts[j] = min(cuts[i - 1] + 1 for i in range(1, j + 1) if pal[i][j])   # last piece s[i..j]
        return cuts[-1]
