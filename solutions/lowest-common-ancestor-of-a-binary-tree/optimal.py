class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if not root or root is p or root is q:
            return root
        a = self.lowestCommonAncestor(root.left, p, q)
        b = self.lowestCommonAncestor(root.right, p, q)
        if a and b:
            return root                         # p and q on different sides
        return a or b                           # pass up whatever was found
