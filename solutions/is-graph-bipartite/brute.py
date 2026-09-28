class Solution:
    def isBipartite(self, graph: List[List[int]]) -> bool:
        n = len(graph)
        for mask in range(1 << n):              # every 2-colouring
            if all((mask >> u & 1) != (mask >> w & 1) for u in range(n) for w in graph[u]):
                return True
        return False
