class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        def height(n):                          # recomputed at every level
            return 0 if not n else 1 + max(height(n.left), height(n.right))

        if not root:
            return True
        return abs(height(root.left) - height(root.right)) <= 1 and self.isBalanced(root.left) and self.isBalanced(root.right)
