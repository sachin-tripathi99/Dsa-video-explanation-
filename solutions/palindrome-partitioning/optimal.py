class Solution:
    def partition(self, s: str) -> List[List[str]]:
        n = len(s)
        pal = [[False] * n for _ in range(n)]
        for length in range(1, n + 1):          # shorter pieces first
            for i in range(n - length + 1):
                j = i + length - 1
                pal[i][j] = s[i] == s[j] and (j - i < 2 or pal[i + 1][j - 1])
        out, path = [], []

        def go(i):
            if i == n:
                out.append(path[:])
                return
            for j in range(i, n):
                if pal[i][j]:                   # O(1) lookup
                    path.append(s[i:j + 1])
                    go(j + 1)
                    path.pop()

        go(0)
        return out
