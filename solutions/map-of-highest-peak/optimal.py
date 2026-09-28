from collections import deque

class Solution:
    def highestPeak(self, isWater: List[List[int]]) -> List[List[int]]:
        m, n = len(isWater), len(isWater[0])
        h = [[0 if w else -1 for w in row] for row in isWater]
        q = deque((r, c) for r in range(m) for c in range(n) if isWater[r][c])   # all water at height 0
        while q:
            r, c = q.popleft()
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < m and 0 <= nc < n and h[nr][nc] == -1:
                    h[nr][nc] = h[r][c] + 1
                    q.append((nr, nc))
        return h
