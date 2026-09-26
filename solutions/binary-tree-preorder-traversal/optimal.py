class Solution:
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        out, cur = [], root
        while cur:
            if not cur.left:
                out.append(cur.val)
                cur = cur.right
                continue
            pre = cur.left
            while pre.right and pre.right is not cur:
                pre = pre.right                 # rightmost of left subtree
            if not pre.right:
                pre.right = cur                 # thread back to cur
                out.append(cur.val)             # pre-order: visit on the way down
                cur = cur.left
            else:
                pre.right = None                # remove the thread
                cur = cur.right
        return out
