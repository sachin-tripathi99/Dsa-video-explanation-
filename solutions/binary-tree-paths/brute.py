class Solution:
    def binaryTreePaths(self, root: Optional[TreeNode]) -> List[str]:
        out = []

        def dfs(node, s):
            if not node:
                return
            s = f"{s}->{node.val}" if s else str(node.val)   # new string each call
            if not node.left and not node.right:
                out.append(s)
                return
            dfs(node.left, s)
            dfs(node.right, s)

        dfs(root, "")
        return out
