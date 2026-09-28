class Solution:
    def getMinimumDifference(self, root: Optional[TreeNode]) -> int:
        prev, best = None, float("inf")

        def inorder(n):
            nonlocal prev, best
            if not n:
                return
            inorder(n.left)
            if prev is not None:
                best = min(best, n.val - prev)  # sorted: compare with the neighbour
            prev = n.val
            inorder(n.right)

        inorder(root)
        return best
