import heapq

class Solution:
    def minimumEffortPath(self, heights: List[List[int]]) -> int:
        R, C = len(heights), len(heights[0])
        eff = [[float("inf")] * C for _ in range(R)]
        eff[0][0] = 0
        pq = [(0, 0, 0)]
        while pq:
            d, r, c = heapq.heappop(pq)
            if d > eff[r][c]:
                continue                        # stale
            if (r, c) == (R - 1, C - 1):
                return d                        # popped = final
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < R and 0 <= nc < C:
                    e = max(d, abs(heights[nr][nc] - heights[r][c]))   # worst step so far
                    if e < eff[nr][nc]:
                        eff[nr][nc] = e
                        heapq.heappush(pq, (e, nr, nc))
        return 0
