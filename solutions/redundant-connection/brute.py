class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        n = len(edges)
        adj = [[] for _ in range(n + 1)]

        def connected(a, b):
            seen = {a}
            stack = [a]
            while stack:
                x = stack.pop()
                if x == b:
                    return True
                for y in adj[x]:
                    if y not in seen:
                        seen.add(y)
                        stack.append(y)
            return False

        for a, b in edges:
            if connected(a, b):
                return [a, b]
            adj[a].append(b)
            adj[b].append(a)
        return []
