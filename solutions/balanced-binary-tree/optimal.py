class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        def h(n):                               # height, or -1 if unbalanced below
            if not n:
                return 0
            a = h(n.left)
            if a == -1:
                return -1
            b = h(n.right)
            if b == -1 or abs(a - b) > 1:
                return -1
            return 1 + max(a, b)

        return h(root) != -1
