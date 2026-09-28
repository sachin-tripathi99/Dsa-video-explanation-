class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        edges = sorted((abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1]), i, j)
                       for i in range(n) for j in range(i + 1, n))    # every pair
        parent = list(range(n))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        total = used = 0
        for w, i, j in edges:
            a, b = find(i), find(j)
            if a == b:
                continue                        # would close a cycle
            parent[a] = b
            total += w
            used += 1
            if used == n - 1:
                break
        return total
