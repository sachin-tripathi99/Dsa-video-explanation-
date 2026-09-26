class Solution:
    def makeConnected(self, n: int, connections: List[List[int]]) -> int:
        if len(connections) < n - 1:
            return -1                               # not enough cables in total
        adj = [[] for _ in range(n)]
        for a, b in connections:
            adj[a].append(b)
            adj[b].append(a)
        seen = [False] * n
        components = 0
        for s in range(n):
            if seen[s]:
                continue
            components += 1
            seen[s] = True
            stack = [s]
            while stack:
                x = stack.pop()
                for y in adj[x]:
                    if not seen[y]:
                        seen[y] = True
                        stack.append(y)
        return components - 1
