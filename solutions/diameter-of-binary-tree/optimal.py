class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        best = 0

        def height(n):
            nonlocal best
            if not n:
                return 0
            a, b = height(n.left), height(n.right)
            best = max(best, a + b)             # path bending at n
            return 1 + max(a, b)                # only one branch goes up

        height(root)
        return best
