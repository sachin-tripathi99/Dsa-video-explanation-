class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        out, st = [], [root] if root else []
        while st:                               # node, right, left …
            node = st.pop()
            out.append(node.val)
            if node.left:
                st.append(node.left)
            if node.right:
                st.append(node.right)
        return out[::-1]                        # … reversed → left, right, node
