class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        out = []

        def dfs(node):
            if not node:
                return
            dfs(node.left)                      # left
            out.append(node.val)                # node
            dfs(node.right)                     # right

        dfs(root)
        return out
