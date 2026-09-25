class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def valid(n, low, high):
            if not n:
                return True
            if not (low < n.val < high):                          # outside the allowed range
                return False
            return valid(n.left, low, n.val) and valid(n.right, n.val, high)

        return valid(root, float("-inf"), float("inf"))
