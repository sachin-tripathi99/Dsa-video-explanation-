from collections import deque

class Solution:
    def highestPeak(self, isWater: List[List[int]]) -> List[List[int]]:
        m, n = len(isWater), len(isWater[0])
        h = [[0] * n for _ in range(m)]
        for sr in range(m):
            for sc in range(n):
                seen, q = {(sr, sc)}, deque([(sr, sc, 0)])   # fresh BFS per cell
                while q:
                    r, c, d = q.popleft()
                    if isWater[r][c]:
                        h[sr][sc] = d
                        break
                    for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                        if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in seen:
                            seen.add((nr, nc))
                            q.append((nr, nc, d + 1))
        return h
