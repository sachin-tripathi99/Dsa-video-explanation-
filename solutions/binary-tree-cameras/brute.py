class Solution:
    def minCameraCover(self, root: Optional[TreeNode]) -> int:
        nodes, parent = [], {}

        def collect(x, p):
            if x:
                nodes.append(x)
                parent[x] = p
                collect(x.left, x)
                collect(x.right, x)

        collect(root, None)
        n, best = len(nodes), len(nodes)
        for mask in range(1 << n):              # every set of camera nodes
            k = bin(mask).count("1")
            if k >= best:
                continue
            seen = set()
            for i in range(n):
                if mask >> i & 1:
                    x = nodes[i]
                    seen.update(y for y in (x, parent[x], x.left, x.right) if y)
            if len(seen) == n:
                best = k
        return best
