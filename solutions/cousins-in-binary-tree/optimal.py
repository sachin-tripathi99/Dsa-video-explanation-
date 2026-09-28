from collections import deque

class Solution:
    def isCousins(self, root: Optional[TreeNode], x: int, y: int) -> bool:
        q = deque([root])
        while q:
            found = set()
            for _ in range(len(q)):
                n = q.popleft()
                found.add(n.val)
                if n.left and n.right and {n.left.val, n.right.val} == {x, y}:
                    return False                # siblings are not cousins
                if n.left:
                    q.append(n.left)
                if n.right:
                    q.append(n.right)
            if x in found and y in found:
                return True
            if x in found or y in found:
                return False                    # different depths
        return False
