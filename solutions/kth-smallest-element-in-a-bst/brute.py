class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        vals = []

        def inorder(n):
            if n:
                inorder(n.left)
                vals.append(n.val)
                inorder(n.right)

        inorder(root)
        return vals[k - 1]
