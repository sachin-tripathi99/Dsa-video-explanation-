class Solution:
    def countNodes(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        lh = rh = 0
        n = root
        while n:
            lh += 1
            n = n.left
        n = root
        while n:
            rh += 1
            n = n.right
        if lh == rh:
            return (1 << lh) - 1                               # perfect subtree
        return 1 + self.countNodes(root.left) + self.countNodes(root.right)
