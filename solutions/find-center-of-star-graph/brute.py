class Solution:
    def findCenter(self, edges: List[List[int]]) -> int:
        n = len(edges) + 1
        deg = [0] * (n + 1)
        for a, b in edges:
            deg[a] += 1
            deg[b] += 1
        return next(v for v in range(1, n + 1) if deg[v] == n - 1)
