class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        n = root
        while n:
            if p.val < n.val and q.val < n.val:      # both on the left
                n = n.left
            elif p.val > n.val and q.val > n.val:    # both on the right
                n = n.right
            else:                                    # they split here
                return n
        return None
