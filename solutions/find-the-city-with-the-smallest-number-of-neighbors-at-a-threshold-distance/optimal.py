class Solution:
    def findTheCity(self, n: int, edges: List[List[int]], distanceThreshold: int) -> int:
        INF = float("inf")
        d = [[0 if i == j else INF for j in range(n)] for i in range(n)]
        for a, b, w in edges:
            d[a][b] = d[b][a] = w
        for k in range(n):                      # stopover k outermost
            for i in range(n):
                for j in range(n):
                    if d[i][k] + d[k][j] < d[i][j]:
                        d[i][j] = d[i][k] + d[k][j]
        best, best_cnt = -1, INF
        for i in range(n):
            cnt = sum(1 for j in range(n) if j != i and d[i][j] <= distanceThreshold)
            if cnt <= best_cnt:                 # ≤ keeps the larger index
                best, best_cnt = i, cnt
        return best
