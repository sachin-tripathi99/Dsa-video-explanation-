class Solution:
    def makeConnected(self, n: int, connections: List[List[int]]) -> int:
        parent = list(range(n))
        size = [1] * n

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        components, spare = n, 0
        for a, b in connections:
            ra, rb = find(a), find(b)
            if ra == rb:
                spare += 1                          # already connected: a cable we can move
                continue
            if size[ra] < size[rb]:
                ra, rb = rb, ra
            parent[rb] = ra
            size[ra] += size[rb]
            components -= 1
        return components - 1 if spare >= components - 1 else -1
