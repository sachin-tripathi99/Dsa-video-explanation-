class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        out, cur = [], root
        while cur:
            if not cur.left:
                out.append(cur.val)
                cur = cur.right
                continue
            pre = cur.left
            while pre.right and pre.right is not cur:
                pre = pre.right                 # in-order predecessor
            if not pre.right:
                pre.right = cur                 # thread back to cur
                cur = cur.left
            else:
                pre.right = None                # left subtree finished
                out.append(cur.val)             # in-order: visit on the way back
                cur = cur.right
        return out
