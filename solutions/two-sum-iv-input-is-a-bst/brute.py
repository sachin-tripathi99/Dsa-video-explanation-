class Solution:
    def findTarget(self, root: Optional[TreeNode], k: int) -> bool:
        def find(n, x):                         # BST search for the partner
            while n and n.val != x:
                n = n.left if x < n.val else n.right
            return n

        def dfs(n):
            if not n:
                return False
            p = find(root, k - n.val)
            if p and p is not n:
                return True
            return dfs(n.left) or dfs(n.right)

        return dfs(root)
