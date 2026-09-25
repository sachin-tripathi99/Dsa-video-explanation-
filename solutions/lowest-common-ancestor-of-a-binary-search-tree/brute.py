class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        def path(target):
            out, n = [], root
            while n:
                out.append(n)
                if n is target:
                    break
                n = n.left if target.val < n.val else n.right
            return out

        lca = root
        for x, y in zip(path(p), path(q)):
            if x is not y:
                break
            lca = x
        return lca
