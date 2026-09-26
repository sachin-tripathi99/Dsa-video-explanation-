class Solution:
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        out, st = [], [root] if root else []
        while st:
            node = st.pop()
            out.append(node.val)
            if node.right:
                st.append(node.right)           # right first,
            if node.left:
                st.append(node.left)            # so left is popped first
        return out
