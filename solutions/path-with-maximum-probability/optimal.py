import heapq

class Solution:
    def maxProbability(self, n: int, edges: List[List[int]], succProb: List[float], start_node: int, end_node: int) -> float:
        adj = [[] for _ in range(n)]
        for (a, b), p in zip(edges, succProb):
            adj[a].append((b, p))
            adj[b].append((a, p))
        prob = [0.0] * n
        prob[start_node] = 1.0
        pq = [(-1.0, start_node)]              # negate for a max-heap
        while pq:
            neg, u = heapq.heappop(pq)
            p = -neg
            if p < prob[u]:
                continue                        # stale
            if u == end_node:
                return p                        # popped = final
            for w, q in adj[u]:
                if p * q > prob[w]:
                    prob[w] = p * q
                    heapq.heappush(pq, (-prob[w], w))
        return 0.0
