class Solution:
    def findTheCity(self, n: int, edges: List[List[int]], distanceThreshold: int) -> int:
        best, best_cnt = -1, float("inf")
        for s in range(n):                      # Bellman-Ford from every city
            d = [float("inf")] * n
            d[s] = 0
            for _ in range(n - 1):
                for a, b, w in edges:
                    if d[a] + w < d[b]:
                        d[b] = d[a] + w
                    if d[b] + w < d[a]:
                        d[a] = d[b] + w
            cnt = sum(1 for j in range(n) if j != s and d[j] <= distanceThreshold)
            if cnt <= best_cnt:                 # ≤ keeps the larger index
                best, best_cnt = s, cnt
        return best
