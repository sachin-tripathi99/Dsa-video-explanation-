class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        if not root:
            return False
        remain = targetSum - root.val
        if not root.left and not root.right:
            return remain == 0                  # leaf
        return self.hasPathSum(root.left, remain) or self.hasPathSum(root.right, remain)
