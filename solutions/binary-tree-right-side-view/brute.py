from collections import deque

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        out, q = [], deque([root]) if root else deque()
        while q:
            size = len(q)
            for i in range(size):
                n = q.popleft()
                if i == size - 1:
                    out.append(n.val)           # last on this level
                if n.left:
                    q.append(n.left)
                if n.right:
                    q.append(n.right)
        return out
