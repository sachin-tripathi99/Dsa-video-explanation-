import heapq

class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        n = len(grid)
        time = [[float("inf")] * n for _ in range(n)]
        time[0][0] = grid[0][0]
        pq = [(grid[0][0], 0, 0)]
        while pq:
            d, r, c = heapq.heappop(pq)
            if d > time[r][c]:
                continue                        # stale
            if (r, c) == (n - 1, n - 1):
                return d                        # popped = final
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < n and 0 <= nc < n:
                    x = max(d, grid[nr][nc])    # highest cell on the route
                    if x < time[nr][nc]:
                        time[nr][nc] = x
                        heapq.heappush(pq, (x, nr, nc))
        return -1
