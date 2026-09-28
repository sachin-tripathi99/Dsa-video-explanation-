class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        adj = [[] for _ in range(n)]
        for a, b, p in flights:
            adj[a].append((b, p))
        best = float("inf")

        def dfs(city, cost, left):
            nonlocal best
            if city == dst:
                best = min(best, cost)
                return
            if left == 0:
                return
            for nxt, p in adj[city]:            # every route
                dfs(nxt, cost + p, left - 1)

        dfs(src, 0, k + 1)
        return -1 if best == float("inf") else best
