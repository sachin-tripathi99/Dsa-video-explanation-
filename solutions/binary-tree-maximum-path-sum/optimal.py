class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        best = float("-inf")

        def gain(n):
            nonlocal best
            if not n:
                return 0
            a, b = max(0, gain(n.left)), max(0, gain(n.right))   # drop negative branches
            best = max(best, n.val + a + b)     # path bending at n
            return n.val + max(a, b)            # one branch goes up

        gain(root)
        return best
