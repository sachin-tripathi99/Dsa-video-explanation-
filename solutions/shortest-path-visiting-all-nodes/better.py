from collections import deque

class Solution:
    def shortestPathLength(self, graph: List[List[int]]) -> int:
        n = len(graph)
        full, INF = (1 << n) - 1, float("inf")
        dist = []
        for s in range(n):                      # all-pairs distances
            d = [-1] * n
            d[s] = 0
            q = deque([s])
            while q:
                u = q.popleft()
                for w in graph[u]:
                    if d[w] < 0:
                        d[w] = d[u] + 1
                        q.append(w)
            dist.append(d)
        dp = [[INF] * n for _ in range(1 << n)]   # dp[mask][last]
        for i in range(n):
            dp[1 << i][i] = 0
        for mask in range(1, full + 1):
            for last in range(n):
                if dp[mask][last] == INF:
                    continue
                for w in range(n):
                    if not mask >> w & 1:
                        nm = mask | 1 << w
                        dp[nm][w] = min(dp[nm][w], dp[mask][last] + dist[last][w])
        return min(dp[full])
