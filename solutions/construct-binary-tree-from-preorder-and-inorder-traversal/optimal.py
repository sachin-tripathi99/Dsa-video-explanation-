class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        pos = {x: k for k, x in enumerate(inorder)}
        it = iter(preorder)                     # next root in preorder

        def build(lo, hi):                      # inorder range [lo, hi]
            if lo > hi:
                return None
            root = TreeNode(next(it))
            m = pos[root.val]
            root.left = build(lo, m - 1)
            root.right = build(m + 1, hi)
            return root

        return build(0, len(inorder) - 1)
