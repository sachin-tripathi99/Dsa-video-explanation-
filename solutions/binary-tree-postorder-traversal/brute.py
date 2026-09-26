class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        out = []

        def dfs(node):
            if not node:
                return
            dfs(node.left)                      # left
            dfs(node.right)                     # right
            out.append(node.val)                # node

        dfs(root)
        return out
