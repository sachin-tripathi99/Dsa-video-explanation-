from collections import deque

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        q = deque([root] if root else [])
        while q:
            n = q.popleft()
            n.left, n.right = n.right, n.left        # swap
            if n.left:
                q.append(n.left)
            if n.right:
                q.append(n.right)
        return root
