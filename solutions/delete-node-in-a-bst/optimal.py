class Solution:
    def deleteNode(self, root: Optional[TreeNode], key: int) -> Optional[TreeNode]:
        if not root:
            return None
        if key < root.val:
            root.left = self.deleteNode(root.left, key)
        elif key > root.val:
            root.right = self.deleteNode(root.right, key)
        else:
            if not root.left:
                return root.right               # 0 or 1 child
            if not root.right:
                return root.left
            s = root.right
            while s.left:
                s = s.left                      # in-order successor
            root.val = s.val
            root.right = self.deleteNode(root.right, s.val)
        return root
