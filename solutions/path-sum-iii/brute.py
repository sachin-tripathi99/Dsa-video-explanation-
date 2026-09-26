class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
        def from_(n, remain):                   # paths starting at n
            if not n:
                return 0
            remain -= n.val
            return (remain == 0) + from_(n.left, remain) + from_(n.right, remain)

        if not root:
            return 0
        return from_(root, targetSum) + self.pathSum(root.left, targetSum) + self.pathSum(root.right, targetSum)
