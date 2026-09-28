class Solution:
    def findMinHeightTrees(self, n: int, edges: List[List[int]]) -> List[int]:
        if n <= 2:
            return list(range(n))
        adj = [[] for _ in range(n)]
        for a, b in edges:
            adj[a].append(b)
            adj[b].append(a)
        deg = [len(a) for a in adj]
        leaves = [i for i in range(n) if deg[i] == 1]
        left = n
        while left > 2:                         # peel one layer of leaves
            left -= len(leaves)
            nxt = []
            for x in leaves:
                for w in adj[x]:
                    deg[w] -= 1
                    if deg[w] == 1:
                        nxt.append(w)
            leaves = nxt
        return leaves
