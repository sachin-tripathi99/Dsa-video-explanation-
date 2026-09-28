from collections import deque

class Solution:
    def shortestPathBinaryMatrix(self, grid: List[List[int]]) -> int:
        n = len(grid)
        if grid[0][0] or grid[-1][-1]:
            return -1
        dist = [[0] * n for _ in range(n)]
        dist[0][0] = 1
        q = deque([(0, 0)])
        while q:
            r, c = q.popleft()
            if r == n - 1 and c == n - 1:
                return dist[r][c]
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):           # 8 directions
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < n and not grid[nr][nc] and not dist[nr][nc]:
                        dist[nr][nc] = dist[r][c] + 1   # mark when pushing
                        q.append((nr, nc))
        return -1
