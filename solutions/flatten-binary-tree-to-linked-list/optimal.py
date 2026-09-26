class Solution:
    def flatten(self, root: Optional[TreeNode]) -> None:
        cur = root
        while cur:
            if cur.left:
                pre = cur.left
                while pre.right:
                    pre = pre.right             # rightmost of the left subtree
                pre.right = cur.right           # right subtree follows it
                cur.right, cur.left = cur.left, None   # left subtree moves right
            cur = cur.right
