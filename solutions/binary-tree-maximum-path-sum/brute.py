class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        def down(n):                            # best downward path, recomputed each time
            if not n:
                return 0
            return n.val + max(0, down(n.left), down(n.right))

        def best(n):
            if not n:
                return float("-inf")
            here = n.val + max(0, down(n.left)) + max(0, down(n.right))   # n as the top
            return max(here, best(n.left), best(n.right))

        return best(root)
