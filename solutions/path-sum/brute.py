class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        paths = []

        def collect(node, path):
            if not node:
                return
            path = path + [node.val]            # copy at each node
            if not node.left and not node.right:
                paths.append(path)
            collect(node.left, path)
            collect(node.right, path)

        collect(root, [])
        return any(sum(p) == targetSum for p in paths)
