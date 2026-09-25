class Solution:
    def searchBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        if not root or root.val == val:
            return root
        return self.searchBST(root.left, val) or self.searchBST(root.right, val)   # search everywhere
