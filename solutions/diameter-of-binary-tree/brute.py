class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        def height(n):                          # recomputed for every ancestor
            return 0 if not n else 1 + max(height(n.left), height(n.right))

        if not root:
            return 0
        through = height(root.left) + height(root.right)   # path bending here
        return max(through, self.diameterOfBinaryTree(root.left), self.diameterOfBinaryTree(root.right))
