class Solution:
    def getMinimumDifference(self, root: Optional[TreeNode]) -> int:
        vals = []

        def collect(n):
            if n:
                vals.append(n.val)
                collect(n.left)
                collect(n.right)

        collect(root)
        return min(abs(a - b) for i, a in enumerate(vals) for b in vals[i + 1:])
