class Solution:
    def flatten(self, root: Optional[TreeNode]) -> None:
        nodes = []

        def pre(n):
            if n:
                nodes.append(n)
                pre(n.left)
                pre(n.right)

        pre(root)
        for i, n in enumerate(nodes):
            n.left = None
            n.right = nodes[i + 1] if i + 1 < len(nodes) else None
