class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        vals = []

        def inorder(n):
            if n:
                inorder(n.left)
                vals.append(n.val)
                inorder(n.right)

        inorder(root)
        return all(vals[i - 1] < vals[i] for i in range(1, len(vals)))
