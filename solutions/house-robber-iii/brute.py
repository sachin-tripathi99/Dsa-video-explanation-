class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        take = root.val                         # rob it: jump to grandchildren
        if root.left:
            take += self.rob(root.left.left) + self.rob(root.left.right)
        if root.right:
            take += self.rob(root.right.left) + self.rob(root.right.right)
        skip = self.rob(root.left) + self.rob(root.right)   # skip it: children are free
        return max(take, skip)
