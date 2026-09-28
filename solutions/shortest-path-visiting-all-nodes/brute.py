from collections import deque
from itertools import permutations

class Solution:
    def shortestPathLength(self, graph: List[List[int]]) -> int:
        n = len(graph)
        dist = []
        for s in range(n):                      # all-pairs distances by BFS
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
        return min(sum(dist[p[i]][p[i + 1]] for i in range(n - 1)) for p in permutations(range(n)))   # every order
