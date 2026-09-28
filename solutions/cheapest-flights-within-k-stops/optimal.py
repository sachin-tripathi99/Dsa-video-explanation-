class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        cost = [float("inf")] * n
        cost[src] = 0
        for _ in range(k + 1):                  # k + 1 flights at most
            prev = cost[:]                      # read only last round's prices
            for a, b, p in flights:
                if prev[a] + p < cost[b]:
                    cost[b] = prev[a] + p
        return -1 if cost[dst] == float("inf") else cost[dst]
