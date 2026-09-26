class Solution:
    def binaryTreePaths(self, root: Optional[TreeNode]) -> List[str]:
        out, path = [], []

        def dfs(node):
            if not node:
                return
            path.append(str(node.val))          # choose
            if not node.left and not node.right:
                out.append("->".join(path))     # build a string only at leaves
            dfs(node.left)
            dfs(node.right)
            path.pop()                          # un-choose

        dfs(root)
        return out
