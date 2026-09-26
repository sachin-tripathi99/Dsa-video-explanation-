class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        def path(node, target, out):            # root → target
            if not node:
                return False
            out.append(node)
            if node is target or path(node.left, target, out) or path(node.right, target, out):
                return True
            out.pop()
            return False

        a, b = [], []
        path(root, p, a)
        path(root, q, b)
        lca = None
        for x, y in zip(a, b):
            if x is not y:
                break
            lca = x
        return lca
