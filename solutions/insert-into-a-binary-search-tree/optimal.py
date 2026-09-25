class Solution:
    def insertIntoBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        node = TreeNode(val)
        if not root:
            return node
        cur = root
        while True:
            if val < cur.val:
                if not cur.left:
                    cur.left = node
                    return root
                cur = cur.left
            else:
                if not cur.right:
                    cur.right = node
                    return root
                cur = cur.right
