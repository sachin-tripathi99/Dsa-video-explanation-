class Solution:
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        out = []

        def dfs(node):
            if not node:
                return
            out.append(node.val)                # node
            dfs(node.left)                      # left
            dfs(node.right)                     # right

        dfs(root)
        return out
