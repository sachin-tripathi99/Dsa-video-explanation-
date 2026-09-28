class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        best = [float("inf")] * n               # cheapest link from the tree
        best[0] = 0
        in_tree = [False] * n
        total = 0
        for _ in range(n):
            u = min((i for i in range(n) if not in_tree[i]), key=lambda i: best[i])
            in_tree[u] = True
            total += best[u]
            ux, uy = points[u]
            for i in range(n):
                if not in_tree[i]:
                    best[i] = min(best[i], abs(ux - points[i][0]) + abs(uy - points[i][1]))
        return total
