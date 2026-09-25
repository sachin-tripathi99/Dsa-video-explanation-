class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        def mirror_copy(n):
            return None if not n else TreeNode(n.val, mirror_copy(n.right), mirror_copy(n.left))

        def same(a, b):
            if not a or not b:
                return a is b
            return a.val == b.val and same(a.left, b.left) and same(a.right, b.right)

        return same(root, mirror_copy(root))
